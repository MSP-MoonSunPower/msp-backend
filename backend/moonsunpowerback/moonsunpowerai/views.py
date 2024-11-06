from openai import OpenAI
from django.utils import timezone
from datetime import timedelta
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import os
from dotenv import load_dotenv
from pathlib import Path
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import Text
from rest_framework import status  
from .models import Text, GeneratedText, QuestionItem
import json
from .prompts import DIFFICULTY_PROMPTS, WORD_DIFFICULTY_PROMPTS, TEXT_LENGTH

    
load_dotenv()

class TodayTextAPIView(APIView):
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
            
            # 최종 응답 데이터 구성
            response_data = {
                "content": latest_text.content,
                "date": latest_text.date,
                "questions": questions_data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        # GeneratedText가 없을 경우
        return Response({'error': 'No content found'}, status=status.HTTP_404_NOT_FOUND)
    
    
class GenerateTextAPIView(APIView):
    """
    View that generates an educational text based on a provided subject.
    """
    
    def get(self, request, subject, difficulty, *args, **kwargs):
        # Retrieve 'subject' from request parameters
        if difficulty not in DIFFICULTY_PROMPTS:
            return Response({"error": "Invalid difficulty level. Choose a value between 1 and 4."},
                            status=status.HTTP_400_BAD_REQUEST)
        if not subject:
            return Response({"error": "Subject parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        prompt_text = DIFFICULTY_PROMPTS[difficulty]
        text_length=TEXT_LENGTH[difficulty]
        # Initialize the OpenAI client
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

        # Generate response using OpenAI API
        response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
            "role": "system",
            "content": [
            {
                "type": "text",
                "text": prompt_text
            }
            ]
        },
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": subject
            }
        ]
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
        
        # Parse the content from the response
        content = response.choices[0].message.content  # response에서 content 가져오기

        # Text 객체 생성
        generated_text = Text.objects.create(
            subject=subject,
            difficulty=difficulty,
            content=content
        )

        # Assuming `content` is in JSON format and contains questions
        response_data = json.loads(content)

        # QuestionItem 객체 생성
        for question in response_data.get("questions", []):
            QuestionItem.objects.create(
                text=generated_text,
                question_text=question["question_text"],
                choice1=question["choice1"],
                choice2=question["choice2"],
                choice3=question["choice3"],
                choice4=question["choice4"],
                choice5=question["choice5"],
                answer=int(question["answer"]),  # 이 값은 정수여야 하므로, answer 값을 정수로 변환해야 함
                explanation=question["explanation"]
            )

        return Response({"subject": generated_text.subject, 
                        "content": generated_text.content,
                        "difficulty": generated_text.difficulty}, 
                        status=status.HTTP_201_CREATED)



class UnknownWordsAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Process a list of unknown words with a specified difficulty level.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'unknown_words': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING),
                    description="List of unknown words to define."
                ),
                'difficulty': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Difficulty level (1-4)."
                ),
            },
            required=['unknown_words', 'difficulty'],
        ),
        responses={200: "Success", 400: "Invalid input"}
    )
    def post(self, request, *args, **kwargs):
        unknown_words = request.data.get("unknown_words", [])
        difficulty = request.data.get("difficulty")
        client = OpenAI()
        if not unknown_words:
            return Response({"error": "No words provided"}, status=status.HTTP_400_BAD_REQUEST)
        if difficulty not in WORD_DIFFICULTY_PROMPTS:
            return Response({"error": "Invalid difficulty level. Choose a value between 1 and 4."},
                            status=status.HTTP_400_BAD_REQUEST)
        prompt_text = WORD_DIFFICULTY_PROMPTS[difficulty]
        # Initialize the OpenAI client
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        prompt_input = f"{prompt_text}\nWords: {', '.join(unknown_words)}"
        
        # Generate response using OpenAI API
        response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
            "role": "system",
            "content": [
            {
                "type": "text",
                "text": prompt_text
            }
            ]
        },
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": prompt_input
            }
        ]
        },
        ],
        temperature=1,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        response_format={
        "type": "json_object"      
        }
            
        )

        content = response.choices[0].message.content
        response_data = json.loads(content)

        return Response({"definitions": response_data}, status=status.HTTP_200_OK)