from rest_framework import serializers
from .models import CustomText, GeneratedText, QuestionItem, SolvedText

# 개별 질문 항목 Serializer
class QuestionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionItem
        fields = [
            'question_text',
            'choice1', 'choice2', 'choice3', 'choice4', 'choice5',
            'answer', 'explanation'
        ]


# GeneratedText용 Serializer (자동 생성 지문)
class GeneratedTextSerializer(serializers.ModelSerializer):
    questions = QuestionItemSerializer(many=True, source='question_items')  # related_name 사용

    class Meta:
        model = GeneratedText
        fields = ['id', 'subject', 'content', 'date', 'created_at', 'questions']


# CustomText용 Serializer (사용자 생성 지문)
class CustomTextSerializer(serializers.ModelSerializer):
    questions = QuestionItemSerializer(many=True, source='question_items')  # related_name 사용

    class Meta:
        model = CustomText
        fields = [
            'id', 'subject', 'difficulty', 'content',
            'date', 'created_at', 'is_tag_text', 'questions'
        ]

# SolvedText용 Serializer (제출 이력)
class SolvedTextSerializer(serializers.ModelSerializer):
    custom_text = CustomTextSerializer()  # 전체 지문 정보 포함

    class Meta:
        model = SolvedText
        fields = ['id', 'custom_text', 'solved_at']
