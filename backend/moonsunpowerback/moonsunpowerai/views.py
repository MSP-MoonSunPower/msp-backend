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
import json
    
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
            max_tokens=2048,
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
