# moonsunpowerai/tasks.py
from celery import shared_task
from .models import GeneratedText  # Assuming you have a model to store the text
from openai import OpenAI
import os
from django.utils import timezone

@shared_task
def generate_and_save_text():            
    client = OpenAI( api_key=os.environ.get("OPENAI_API_KEY"))
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
        "role": "system",
        "content": [
            {
            "type": "text",
            "text": "make a educational text.\ndo not use paragraph titles.\ncreate it into json format, like\n{'paragraph1': 'text'}\nwrite it into korean"
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
    GeneratedText.objects.create(date=timezone.now().date(), content=response)


