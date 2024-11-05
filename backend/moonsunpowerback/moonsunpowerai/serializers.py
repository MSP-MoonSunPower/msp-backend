# serializers.py
from rest_framework import serializers
from .models import Text

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ['id', 'subject', 'date', 'content', 'created_at']
