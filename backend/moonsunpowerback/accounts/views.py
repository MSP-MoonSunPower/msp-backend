from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated


from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

User = get_user_model()

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="회원가입 API (이메일 인증 기반)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["username", "password", "email", "nickname", "name"],
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING, description="사용자 이름"),
                "password": openapi.Schema(type=openapi.TYPE_STRING, description="비밀번호"),
                "email": openapi.Schema(type=openapi.TYPE_STRING, description="이메일"),
                "nickname": openapi.Schema(type=openapi.TYPE_STRING, description="닉네임"),
                "name": openapi.Schema(type=openapi.TYPE_STRING, description="한국 이름 (선택)"),
                "birth_date": openapi.Schema(type=openapi.TYPE_STRING, description="YYYY-MM-DD 형식 (선택)"),
                "rank": openapi.Schema(type=openapi.TYPE_STRING, description="사용자 등급 (기본: normal)"),
                "profile_image": openapi.Schema(type=openapi.TYPE_STRING, format="binary", description="프로필 사진 (jpg/png)")
            }
        ),
        responses={
            201: openapi.Response("회원가입 성공. 이메일 인증 필요"),
            400: "필수값 누락 또는 유효하지 않은 입력"
        }
    )
    def post(self, request, *args, **kwargs):
        data = request.data
        username   = data.get("username")
        password   = data.get("password")
        email      = data.get("email")
        nickname   = data.get("nickname")
        name       = data.get("name", "")
        birth_date = data.get("birth_date")
        rank       = data.get("rank", "normal")

        if not (username and password and email and nickname and name):
            return Response({"detail": "필수값(username, password, email, nickname, name) 누락"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except ValidationError:
            return Response({"detail": "유효하지 않은 이메일 형식입니다."}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({"detail": "이미 존재하는 username 입니다."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"detail": "이미 존재하는 email 입니다."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(nickname=nickname).exists():
            return Response({"detail": "이미 존재하는 nickname 입니다."}, status=status.HTTP_400_BAD_REQUEST)

        profile_image = request.FILES.get("profile_image")

        try:
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                nickname=nickname,
                name=name,
                birth_date=birth_date,
                rank=rank,
                profile_image=profile_image
            )
            user.is_active = False  # 인증 전 로그인 제한
            user.save()

            self.send_verification_email(user, request)

            return Response({"message": "회원가입 성공. 이메일 인증을 완료해주세요."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def send_verification_email(self, user, request):
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        host = request.get_host()
        frontend_base_url = settings.FRONTEND_DOMAINS.get(host, "https://moonsunpower.com")
        verify_url = f"{frontend_base_url}/verify-email?uid={uid}&token={token}"

        send_mail(
            subject="[MoonsunPower] 이메일 인증",
            message=f"다음 링크를 클릭하여 이메일을 인증하세요:\n{verify_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
class EmailVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="이메일 인증 확인",
        operation_description="링크로 받은 uid와 token을 사용해 사용자의 이메일 인증을 완료합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["uid", "token"],
            properties={
                "uid": openapi.Schema(type=openapi.TYPE_STRING, description="Base64 인코딩된 사용자 ID"),
                "token": openapi.Schema(type=openapi.TYPE_STRING, description="Django 토큰"),
            }
        ),
        responses={
            200: openapi.Response(description="이메일 인증 성공"),
            400: openapi.Response(description="유효하지 않은 요청")
        }
    )
    def post(self, request):
        uidb64 = request.data.get("uid")
        token = request.data.get("token")

        if not uidb64 or not token:
            return Response({"error": "uid와 token은 필수입니다."}, status=400)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "유효하지 않은 사용자입니다."}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "유효하지 않은 토큰입니다."}, status=400)

        user.is_active = True
        user.save()
        return Response({"message": "이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다."}, status=200)

# 로그인 API
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="로그인 API",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["username", "password"],
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING, description="사용자 이름"),
                "password": openapi.Schema(type=openapi.TYPE_STRING, description="비밀번호"),
            }
        ),
        responses={
            200: openapi.Response("로그인 성공", schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={"token": openapi.Schema(type=openapi.TYPE_STRING)}
            )),
            400: "username과 password 누락",
            401: "인증 실패"
        }
    )
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

    @swagger_auto_schema(
    operation_description="로그아웃 API",
    security=[{'Token': []}],
    responses={
        200: openapi.Response("로그아웃 성공", schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={"detail": openapi.Schema(type=openapi.TYPE_STRING)}
        )),
        400: "토큰 삭제 중 오류 발생"
    }
)
    def post(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()
        except Exception as e:
            return Response({"detail": f"토큰 삭제 중 오류 발생: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "로그아웃 성공"}, status=status.HTTP_200_OK)

class UserDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="회원 탈퇴 API",
        responses={
            200: openapi.Response(
                "회원 탈퇴 성공",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING, description="탈퇴 완료 메시지")
                    }
                )
            ),
            400: "회원 탈퇴 중 오류 발생"
        }
    )
    def delete(self, request, *args, **kwargs):
        user = request.user
        try:
            # 프로필 사진 파일 삭제 (있을 경우)
            if user.profile_image:
                user.profile_image.delete(save=False)
            # 사용자 계정 삭제
            user.delete()
            return Response({"detail": "회원 탈퇴가 완료되었습니다."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"회원 탈퇴 중 오류 발생: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        

class ProfileImageUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    @swagger_auto_schema(
        operation_description="프로필 사진 변경 API",
        manual_parameters=[
            openapi.Parameter(
                "profile_image",
                openapi.IN_FORM,
                description="새 프로필 사진 (jpg/png)",
                type=openapi.TYPE_FILE,
                required=True
            )
        ],
        consumes=["multipart/form-data"],
        responses={
            200: openapi.Response(
                "프로필 사진 업데이트 성공",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING),
                        "profile_image_url": openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description="업데이트 후 프로필 사진 URL"
                        )
                    }
                )
            ),
            400: "프로필 사진 파일 누락 또는 잘못된 형식"
        }
    )
    def post(self, request, *args, **kwargs):
        profile_image = request.FILES.get("profile_image")
        if not profile_image:
            return Response(
                {"detail": "프로필 사진 파일을 업로드 해주세요."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = request.user
            # 기존 파일이 있다면 storage에서 삭제 (디스크 공간 해제)
            if user.profile_image:
                user.profile_image.delete(save=False)
            user.profile_image = profile_image
            user.save()
            return Response({
                "detail": "프로필 사진이 업데이트되었습니다.",
                "profile_image_url": user.profile_image_url
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": f"프로필 사진 업데이트 중 오류 발생: {e}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class ProfileImageDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="프로필 사진 삭제 API",
        responses={
            200: openapi.Response(
                "프로필 사진 삭제 성공",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(
                            type=openapi.TYPE_STRING, description="삭제 결과 메시지"
                        ),
                        "profile_image_url": openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description="삭제 후 반환되는 프로필 사진 URL (기본 프사 URL)"
                        ),
                    },
                )
            ),
            400: "프로필 사진 삭제 중 오류 발생"
        }
    )
    def delete(self, request, *args, **kwargs):
        try:
            user = request.user
            user.profile_image = None
            user.save()
            return Response({
                "detail": "프로필 사진이 삭제되었습니다.",
                "profile_image_url": user.profile_image_url  # property 통해 기본 프사 URL 반환
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"프로필 사진 삭제 중 오류 발생: {e}"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="사용자 프로필 정보 반환 API",
        responses={
            200: openapi.Response(
                "사용자 프로필 정보",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "username": openapi.Schema(type=openapi.TYPE_STRING, description="사용자 이름"),
                        "profile_image_url": openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description="프로필 사진 URL (프로필 사진이 없으면 기본 이미지 URL)"
                        ),
                    }
                )
            )
        }
    )
    def get(self, request, *args, **kwargs):
        user = request.user
        data = {
            "nickname": user.nickname,
            "profile_image_url": user.profile_image_url,
        }
        return Response(data)