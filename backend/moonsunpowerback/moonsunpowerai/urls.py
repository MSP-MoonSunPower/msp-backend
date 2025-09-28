from django.urls import path
from .views import *

urlpatterns = [
    path('todaytext', TodayTextAPIView.as_view(), name='today_text'),
    path('text/<str:subject>/<int:difficulty>/<str:language>', GenerateTextAPIView.as_view(), name='text-by-subject'),
    path('words',UnknownWordsAPIView.as_view(),name='unknown-word'),
    path('tagtext/<int:subject>/<int:difficulty>',GenerateTagTextAPIView.as_view(),name='tag-text'),
]

