# serializers.py
from rest_framework import serializers
from .models import Text, GeneratedText, QuestionItem

# QuestionItem Serializer
class QuestionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionItem
        fields = ['question_text', 'choice1', 'choice2', 'choice3', 'choice4', 'choice5', 'answer', 'explanation']

# GeneratedText Serializer
class GeneratedTextSerializer(serializers.ModelSerializer):
    questions = QuestionItemSerializer(many=True, source='question_items')  # `related_name` 사용

    class Meta:
        model = GeneratedText
        fields = ['content', 'date', 'questions']

# Text Serializer 
class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ['subject', 'difficulty', 'content', 'date']
