from django.contrib.auth import get_user_model, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status, permissions
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

User = get_user_model()

# 회원가입 API
class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        username   = data.get("username")
        password   = data.get("password")
        email      = data.get("email")
        nickname   = data.get("nickname")
        name       = data.get("name", "")        # 한국 이름 (중복 허용)
        birth_date = data.get("birth_date")        # YYYY-MM-DD 형식
        rank       = data.get("rank", "normal")

        # 필수값 체크
        if not (username and password and email and nickname):
            return Response({"detail": "필수값(username, password, email, nickname) 누락"}, status=status.HTTP_400_BAD_REQUEST)

        # 이메일 유효성 검사
        try:
            validate_email(email)
        except ValidationError:
            return Response({"detail": "유효하지 않은 이메일 형식입니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 중복 체크: username, email, nickname은 unique
        if User.objects.filter(username=username).exists():
            return Response({"detail": "이미 존재하는 username 입니다."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"detail": "이미 존재하는 email 입니다."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(nickname=nickname).exists():
            return Response({"detail": "이미 존재하는 nickname 입니다."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                nickname=nickname,
                name=name,
                birth_date=birth_date,
                rank=rank
            )
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# 로그인 API
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        if not (username and password):
            return Response({"detail": "username과 password를 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"detail": "인증 실패"}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)

# 로그아웃 API (토큰 삭제)
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()
        except Exception as e:
            return Response({"detail": f"토큰 삭제 중 오류 발생: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "로그아웃 성공"}, status=status.HTTP_200_OK)
