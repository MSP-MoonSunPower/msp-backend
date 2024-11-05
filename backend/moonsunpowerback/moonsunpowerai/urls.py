from django.urls import path
from .views import TodayTextAPIView
from .views import GenerateTextAPIView

urlpatterns = [
    path('todaytext/', TodayTextAPIView.as_view(), name='today_text'),
    path('api/text/<str:subject>/', GenerateTextAPIView.as_view(), name='text-by-subject'),
]
