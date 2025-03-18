from rest_framework import serializers
from models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.ReadOnlyField()

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'nickname', 'profile_image_url')
