from django.urls import path
from .views import TodayTextAPIView
urlpatterns = [
    path('todaytext/', TodayTextAPIView.as_view(), name='today_text'),
]
