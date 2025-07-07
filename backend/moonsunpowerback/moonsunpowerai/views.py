import os
import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import AllowAny
from openai import OpenAI
from .models import CustomText, GeneratedText, QuestionItem
from .prompts import *
from dotenv import load_dotenv
import re

load_dotenv()

class TodayTextAPIView(APIView):
    permission_classes = [AllowAny]
    """
    API to fetch the latest generated text entry along with its related question items.
    """

    @swagger_auto_schema(
        operation_summary="Get the latest generated text with related questions",
        operation_description="Fetches the most recent generated text along with associated question items.",
        responses={
            200: openapi.Response(
                description="Successful response",
                examples={
                    "application/json": {
                        "content": "Generated content here...",
                        "date": "2023-01-01",
                        "questions": [
                            {
                                "question_text": "Sample question?",
                                "choice1": "Option 1",
                                "choice2": "Option 2",
                                "choice3": "Option 3",
                                "choice4": "Option 4",
                                "choice5": "Option 5",
                                "answer": 1,
                                "explanation": "Sample explanation"
                            }
                        ]
                    }
                }
            ),
            404: openapi.Response(
                description="No content found",
                examples={
                    "application/json": {
                        "error": "No content found"
                    }
                }
            ),
        }
    )
    def get(self, request):
        # 가장 최근의 GeneratedText 가져오기
        latest_text = GeneratedText.objects.order_by('-date').first()
        
        if latest_text:
            # 관련된 QuestionItems 가져오기
            data=json.loads(latest_text.content)
            questions = latest_text.question_items.all()
            questions_data = [
                {
                    "question_text": question.question_text,
                    "choice1": question.choice1,
                    "choice2": question.choice2,
                    "choice3": question.choice3,
                    "choice4": question.choice4,
                    "choice5": question.choice5,
                    "answer": question.answer,
                    "explanation": question.explanation
                }
                for question in questions
            ]
            
            response_data = {
                "content": data["content"],
                "date": latest_text.date,
                "questions": questions_data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        # GeneratedText가 없을 경우
        return Response({'error': 'No content found'}, status=status.HTTP_404_NOT_FOUND)

class GenerateTextAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
    operation_summary="Generate educational text and questions",
    operation_description="""
    주어진 주제(subject), 난이도(difficulty), 언어(language)에 따라
    교육용 텍스트와 객관식 질문을 생성합니다.
    
    예: /text/science/2/korean/
    """,
    responses={
        200: openapi.Response(
            description="성공적으로 텍스트와 질문을 생성한 경우",
            examples={
                "application/json": {
                    "subject": "science",
                    "content": "Generated educational content here...",
                    "date": "2025-05-21",
                    "questions": [
                        {
                            "question_text": "물은 몇 도에서 끓는가?",
                            "choice1": "80도",
                            "choice2": "90도",
                            "choice3": "100도",
                            "choice4": "110도",
                            "choice5": "120도",
                            "answer": 3,
                            "explanation": "물은 1기압에서 100도에서 끓는다."
                        }
                    ]
                }
            }
        ),
        400: openapi.Response(
            description="잘못된 요청 파라미터 (예: 지원하지 않는 언어 또는 난이도)",
            examples={
                "application/json": {
                    "error": "Unsupported language 'japanese'"
                }
            }
        ),
        500: openapi.Response(
            description="OpenAI API 호출 실패 또는 JSON 파싱 오류",
            examples={
                "application/json": {
                    "error": "Invalid JSON format in API response"
                }
            }
        ),
    }
    )
    def get(self, request, subject, difficulty,language, *args, **kwargs):
        language = language.lower()
        if not subject:
            return Response(
                {"error": "Subject parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        prompt_key = f"user_select_text_prompt_{difficulty}"

        # 언어 유효성 검사
        if language not in USER_SELECT_TEXT_PROMPTS:
            return Response(
                {"error": f"Unsupported language '{language}'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if prompt_key not in USER_SELECT_TEXT_PROMPTS[language]:
            return Response(
                {"error": f"No prompt found for difficulty {difficulty} in language '{language}'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        prompt_text = USER_SELECT_TEXT_PROMPTS[language][prompt_key]

        # 기존대로 모델 및 텍스트 길이 가져오기 (여기는 언어 독립적이라면 그대로 둬도 됨)
        text_length = int(TEXT_LENGTH.get(str(difficulty)))
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model = str(MODEL_SELECTOR.get(f"model_type_{difficulty}")).strip(),
            messages=[
                {
                    "role": "system",
                    "content": prompt_text
                },
                {
                    "role": "user",
                    "content": subject
                },
            ],
            response_format={
            "type": "json_object"
                },
            temperature=1,
            max_tokens=text_length,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
        )
        content_raw = response.choices[0].message.content
        if not content_raw:
            return Response(
                {"error": "No content received from OpenAI API"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            content_data = json.loads(content_raw)
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON format in API response"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        main_content = content_data.get("content", "")
        questions = content_data.get("questions", [])
        if not main_content.strip() or not questions:
            return Response(
                {"error": "OpenAI API returned empty content or no questions. Please check your subject."},
                status=status.HTTP_400_BAD_REQUEST
            )
        generated_text = CustomText.objects.create(
            subject=subject,
            difficulty=difficulty,
            content=main_content
        )

        questions_data = []
        for question in questions:
            question_item = QuestionItem.objects.create(
                text=generated_text,
                question_text=question["question_text"],
                choice1=question["choice1"],
                choice2=question["choice2"],
                choice3=question["choice3"],
                choice4=question["choice4"],
                choice5=question["choice5"],
                answer=int(question["answer"]),
                explanation=question["explanation"]
            )
            questions_data.append({
                "question_text": question_item.question_text,
                "choice1": question_item.choice1,
                "choice2": question_item.choice2,
                "choice3": question_item.choice3,
                "choice4": question_item.choice4,
                "choice5": question_item.choice5,
                "answer": question_item.answer,
                "explanation": question_item.explanation
            })

        response_data = {
            "subject": generated_text.subject,
            "content": generated_text.content,
            "date": generated_text.date,
            "questions": questions_data
        }

        return Response(response_data, status=status.HTTP_200_OK)

class GenerateTagTextAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        operation_description="Generate educational text and questions based on subject and difficulty level.",
        manual_parameters=[
            openapi.Parameter(
                'subject',
                openapi.IN_PATH,
                description="Subject code (integer between 1 and 6) for generating educational text",
                type=openapi.TYPE_INTEGER
            ),
            openapi.Parameter(
                'difficulty',
                openapi.IN_PATH,
                description="Difficulty level (integer between 1 and 4) for educational content",
                type=openapi.TYPE_INTEGER
            ),
        ],
        responses={
            200: openapi.Response(
                description="Successfully generated educational content and questions",
                examples={
                    "application/json": {
                        "subject": 1,
                        "content": "Generated educational content about the subject",
                        "date": "2023-01-01T00:00:00Z",
                        "questions": [
                            {
                                "question_text": "What is 2+2?",
                                "choice1": "3",
                                "choice2": "4",
                                "choice3": "5",
                                "choice4": "6",
                                "choice5": "7",
                                "answer": 2,
                                "explanation": "The correct answer is 4."
                            }
                        ]
                    }
                }
            ),
            400: openapi.Response(
                description="Invalid parameters or API request errors",
                examples={
                    "application/json": {
                        "error": "Invalid difficulty level. Choose a value between 1 and 4."
                    }
                }
            ),
            500: openapi.Response(
                description="Server error or unexpected response from OpenAI API",
                examples={
                    "application/json": {
                        "error": "No content received from OpenAI API"
                    }
                }
            )
        }
    )
    
    def get(self, request, subject, difficulty, *args, **kwargs):
        # subject를 문자열로 전달하여 setPresetPrompt에서 제대로 찾을 수 있도록 함
        prompt_text = setPresetPrompt(subject, difficulty)
        print(prompt_text)
        if not prompt_text:
            return Response(
                {"error": "태그 주제 텍스트를 찾을 수 없습니다."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        
        try:
            text_length = int(TEXT_LENGTH[str(difficulty)])
        except (KeyError, ValueError):
            return Response(
                {"error": "Invalid text length configuration."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        response = client.chat.completions.create(
            model=str(MODEL_SELECTOR.get(f"model_type_{difficulty}")).strip(),
            messages=[
                {
                    "role": "system",
                    "content": prompt_text
                },
                {
                    "role": "user",
                    "content": "지문 생성"
                },
            ],
            temperature=1,
            max_tokens=text_length,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            response_format={
                "type": "json_object"      
            }
        )
        
        content_raw = response.choices[0].message.content
        if not content_raw:
            return Response({"error": "No content received from OpenAI API"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if "error" in content_raw:
            return Response({"error": "죄송합니다. 다른 단어를 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            content_data = json.loads(content_raw)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format in API response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        main_content = content_data.get("content", "")
        questions = content_data.get("questions", [])

        generated_text = CustomText.objects.create(
            subject=subject,
            difficulty=difficulty,
            content=main_content
        )

        questions_data = []
        for question in questions:
            question_item = QuestionItem.objects.create(
                text=generated_text,
                question_text=question["question_text"],
                choice1=question["choice1"],
                choice2=question["choice2"],
                choice3=question["choice3"],
                choice4=question["choice4"],
                choice5=question["choice5"],
                answer=int(question["answer"]),
                explanation=question["explanation"]
            )
            questions_data.append({
                "question_text": question_item.question_text,
                "choice1": question_item.choice1,
                "choice2": question_item.choice2,
                "choice3": question_item.choice3,
                "choice4": question_item.choice4,
                "choice5": question_item.choice5,
                "answer": question_item.answer,
                "explanation": question_item.explanation
            })

        response_data = {
            "subject": generated_text.subject,
            "content": generated_text.content,
            "date": generated_text.date,
            "questions": questions_data
        }

        return Response(response_data, status=status.HTTP_200_OK)
class UnknownWordsAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        operation_description="사전 API: 입력된 단어 또는 구에 대해 각각의 기본형과 정의를 반환합니다. 단일 단어 입력 시 단일 JSON 객체, 여러 단어 입력 시 JSON 배열로 출력합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'unknown_words': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING),
                    description="정의할 단어 혹은 구의 목록"
                ),
                'difficulty': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="난이도 (1-4)"
                ),
            },
            required=['unknown_words', 'difficulty'],
        ),
        responses={200: "Success", 400: "Invalid input"}
    )
    def post(self, request, *args, **kwargs):
        unknown_words = request.data.get("unknown_words", [])
        difficulty = request.data.get("difficulty")
        if not unknown_words:
            return Response({"error": "No words provided"}, status=status.HTTP_400_BAD_REQUEST)
        if difficulty not in range(1, 5):
            return Response(
                {"error": "Invalid difficulty level. Choose a value between 1 and 4."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # WORD_DEFINITION_DICTIONARY에서 난이도에 맞는 프롬프트를 가져옵니다.
        prompt_key = f"word_definition_dictionary_{difficulty}"
        if prompt_key not in WORD_DEFINITION_DICTIONARY:
            return Response(
                {"error": "No definition prompt available for this difficulty."},
                status=status.HTTP_400_BAD_REQUEST
            )
        prompt_text = WORD_DEFINITION_DICTIONARY[prompt_key]
        prompt_input = f"{prompt_text}\nWords: {', '.join(unknown_words)}"
        
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model=str(MODEL_SELECTOR.get(f"model_type_{difficulty}")).strip(),
            messages=[
                {
                    "role": "system",
                    "content": prompt_text
                },
                {
                    "role": "user",
                    "content": prompt_input
                },
            ],
            temperature=1,
            max_tokens=2048,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        try:
            response_data = json.loads(content)
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON format in API response"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(response_data, status=status.HTTP_200_OK)
