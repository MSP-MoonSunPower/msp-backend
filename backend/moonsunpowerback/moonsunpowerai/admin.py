from django.contrib import admin
from .models import QuestionItem, GeneratedText, CustomText

@admin.register(QuestionItem)
class QuestionItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'question_text', 'answer')

@admin.register(GeneratedText)
class GeneratedTextAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'date')

@admin.register(CustomText)
class CustomTextAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'date')
