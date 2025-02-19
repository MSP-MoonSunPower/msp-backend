from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    name = models.CharField("이름", max_length=50, blank=True, null=True)
    is_email_verified = models.BooleanField("이메일 인증", default=False)
    nickname = models.CharField("닉네임", max_length=30, unique=True)
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
