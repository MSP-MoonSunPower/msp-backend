from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from datetime import date
from .models import DailyLogin
from .utils import calculate_streak

class ActivityPingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        today = date.today()

        # 오늘 기록이 없다면 생성
        DailyLogin.objects.get_or_create(user=user, date=today)

        # 접속 기록 및 streak 계산
        login_dates = list(
            DailyLogin.objects.filter(user=user)
            .order_by('-date')
            .values_list('date', flat=True)
        )
        streak = calculate_streak(login_dates)

        return Response({
            "message": "오늘 접속 기록이 저장되었습니다.",
            "streak": streak,
            "dates": [str(d) for d in login_dates],
            "visited_today": True
        }, status=status.HTTP_200_OK)


class ActivityStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()

        # 접속 날짜 목록 (내림차순)
        login_dates = list(
            DailyLogin.objects.filter(user=user)
            .order_by('-date')
            .values_list('date', flat=True)
        )

        # 연속 접속일 계산
        streak = calculate_streak(login_dates)

        # 오늘 접속했는지 여부
        visited_today = today in login_dates

        return Response({
            "streak": streak,
            "dates": [str(d) for d in login_dates],
            "visited_today": visited_today
        }, status=status.HTTP_200_OK)