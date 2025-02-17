from django.contrib import admin
from .models import QuestionItem, GeneratedText, Text

@admin.register(QuestionItem)
class QuestionItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'question_text', 'answer')  # 원하는 필드 추가

@admin.register(GeneratedText)
class GeneratedTextAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'date')

@admin.register(Text)
class TextAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'date')
