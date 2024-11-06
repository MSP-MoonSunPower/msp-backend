from django.urls import path
from .views import *

urlpatterns = [
    path('todaytext/', TodayTextAPIView.as_view(), name='today_text'),
    path('text/<str:subject>/<int:difficulty>', GenerateTextAPIView.as_view(), name='text-by-subject'),
    path('words/',UnknownWordsAPIView.as_view(),name='unkonwn-word')
]
