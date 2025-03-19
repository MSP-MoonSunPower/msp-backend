import os
import uuid
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.db import models

def validate_image_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png']
    if ext.lower() not in valid_extensions:
        raise ValidationError("지원하지 않는 파일 형식입니다. jpg 또는 png 파일만 업로드 가능합니다.")

def user_profile_image_upload_to(instance, filename):
    ext = os.path.splitext(filename)[1]
    new_filename = f"{instance.username}_{uuid.uuid4().hex}{ext.lower()}"
    return os.path.join("profile_images", new_filename)

class CustomUser(AbstractUser):
    email = models.EmailField("이메일", unique=True)
    name = models.CharField("이름", max_length=50, blank=True, null=True)
    nickname = models.CharField("닉네임", max_length=30, unique=True)
    is_email_verified = models.BooleanField("이메일 인증", default=False)
    birth_date = models.DateField("생년월일", null=True, blank=True)
    rank = models.CharField(
        "등급",
        max_length=10,
        choices=[
            ('normal', '일반'),
            ('vip', 'VIP'),
            ('heedo', '희도'),
        ],
        default='normal'
    )
    profile_image = models.ImageField(
        "프로필 사진",
        upload_to=user_profile_image_upload_to,
        validators=[validate_image_extension],
        blank=True,
        null=True
    )
    @property
    def profile_image_url(self):
        if self.profile_image and hasattr(self.profile_image, 'url'):
            return self.profile_image.url
        # 기본 프사 URL (실제 파일 경로에 맞게 수정)
        return '/static/images/default_profile.png'
