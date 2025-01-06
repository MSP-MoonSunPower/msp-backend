# moonsunpowerai/tasks.py
from celery import shared_task
from .models import GeneratedText, QuestionItem
from openai import OpenAI
import os
from django.utils import timezone
from .prompts import DIFFICULTY_PROMPTS,TEXT_LENGTH
import json
@shared_task
def generate_and_save_text():            
    prompt_key = "difficulty_5"
    prompt_text = DIFFICULTY_PROMPTS[prompt_key]['prompt']
    text_length = TEXT_LENGTH['4'] 
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
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
        "text": "create what you are told to do. make the essay really long." 
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
    
    content = response.choices[0].message.content  # response에서 content 가져오기

        # Text 객체 생성
    generated_text = GeneratedText.objects.create(
        subject="do not know",
        content=content
    )
    # Assuming `content` is in JSON format and contains questions
    response_data = json.loads(content)

    # QuestionItem 객체 생성
    for question in response_data.get("questions", []):
        QuestionItem.objects.create(
            generated_text=generated_text,
            question_text=question["question_text"],
            choice1=question["choice1"],
            choice2=question["choice2"],
            choice3=question["choice3"],
            choice4=question["choice4"],
            choice5=question["choice5"],
            answer=int(question["answer"]),  # 이 값은 정수여야 하므로, answer 값을 정수로 변환해야 함
            explanation=question["explanation"]
        )


