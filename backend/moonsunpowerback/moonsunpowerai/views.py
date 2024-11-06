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
    @swagger_auto_schema(
        operation_description="Get today's generated text",
        responses={200: openapi.Response('Success', schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'text': openapi.Schema(type=openapi.TYPE_STRING, description='Generated text for today'),
            }
        ))}
    )
    def get(self, request, *args, **kwargs):
        # Retrieve 'today_text' from the cache
        today_text = cache.get('today_text')
        
        # If 'today_text' is not in the cache, generate it
        if today_text is None:
            # Prompt content to be generated
            prompt_content = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"Generate a unique educational text for {timezone.now().strftime('%Y-%m-%d')}"
                        }
                    ]
                }
            ]
            
            client = OpenAI( api_key=os.environ.get("OPENAI_API_KEY"))
            response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                "role": "system",
                "content": [
                    {
                    "type": "text",
                    "text": "make a educational text.\ndo not use paragraph titles.\ncreate it into json format, like\n{'paragraph1': 'text'}"
                    }
                ]
                }
            ],
            temperature=1,
            max_tokens=4000,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            response_format={
                "type": "json_object"
            }
            )
            
            # Calculate time remaining until midnight
            # now = timezone.now()
            # midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            # timeout = (midnight - now).seconds

            # # Store in cache until midnight
            # cache.set('today_text', today_text, timeout=timeout)
        
        return Response(response)


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