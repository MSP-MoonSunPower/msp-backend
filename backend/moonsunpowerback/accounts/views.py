from django.contrib.auth import get_user_model, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status, permissions
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
User = get_user_model()

# 회원가입 API
class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="회원가입 API",
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
            201: openapi.Response("회원가입 성공", schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={"token": openapi.Schema(type=openapi.TYPE_STRING)}
            )),
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

        # 파일은 request.FILES에서 가져옴 (없으면 None)
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
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
            "username": user.username,
            "profile_image_url": user.profile_image_url,
        }
        return Response(data)