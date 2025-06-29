from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework.permissions import AllowAny
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

User = get_user_model()

class PasswordResetRequestAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["email"],
            properties={
                "email": openapi.Schema(type=openapi.TYPE_STRING, format='email', description="비밀번호 재설정할 이메일 주소"),
            }
        ),
        responses={200: openapi.Response(description="이메일 전송 성공")},
        operation_summary="비밀번호 재설정 요청",
        operation_description="사용자의 이메일로 비밀번호 재설정 링크를 전송합니다."
    )
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "이메일을 입력해주세요."}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "이메일 전송이 완료되었습니다."}, status=200)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        host = request.get_host()  
        frontend_base_url = settings.FRONTEND_DOMAINS.get(host, "https://moonsunpower.com")  
        reset_link = f"{frontend_base_url}/reset-password?uid={uid}&token={token}" 

        send_mail(
            subject="[MoonsunPower] 비밀번호 재설정",
            message=f"다음 링크를 통해 비밀번호를 재설정하세요:\n{reset_link}",
            from_email="choe.hwan@gmail.com",
            recipient_list=[email],
        )

        return Response({"message": "비밀번호 재설정 링크가 이메일로 전송되었습니다."}, status=200)
    

class PasswordResetConfirmAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["uid", "token", "new_password"],
            properties={
                "uid": openapi.Schema(type=openapi.TYPE_STRING, description="Base64 인코딩된 사용자 ID"),
                "token": openapi.Schema(type=openapi.TYPE_STRING, description="Django의 비밀번호 재설정 토큰"),
                "new_password": openapi.Schema(type=openapi.TYPE_STRING, description="새 비밀번호 (8자 이상 권장)"),
            }
        ),
        responses={200: openapi.Response(description="비밀번호 재설정 완료")},
        operation_summary="비밀번호 재설정",
        operation_description="uid와 토큰을 검증하고, 새 비밀번호로 계정을 업데이트합니다."
    )
    def post(self, request):
        uidb64 = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not (uidb64 and token and new_password):
            return Response({"error": "모든 필드를 입력해주세요."}, status=400)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "유효하지 않은 사용자입니다."}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "유효하지 않은 토큰입니다."}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({"message": "비밀번호가 성공적으로 변경되었습니다."}, status=200)

