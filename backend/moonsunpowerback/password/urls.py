# password/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('password-reset', PasswordResetRequestAPIView.as_view(), name='password_reset_api'),
    path('password-reset/confirm', PasswordResetConfirmAPIView.as_view(), name='password_reset_confirm_api'),
]