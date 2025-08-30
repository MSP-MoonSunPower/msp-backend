# MoonSunPower Backend ✨

MoonSunPower의 백엔드 레포지토리입니다.

## 기술 스택

- Django
- Django REST Framework
- NGINX
- Redis
- Gunicorn
- Celery

## 설치 및 실행

```bash
# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate  # Windows

# 의존성 설치
pip install -r requirements.txt

# 데이터베이스 마이그레이션
python manage.py migrate

# 개발 서버 실행
python manage.py runserver
```

## 프로젝트 구조

```
backend/
├── moonsunpowerback/     # 메인 Django 프로젝트
├── accounts/             # 사용자 계정 관리
├── moonsunpowerai/       # AI 관련 기능
├── password/             # 비밀번호 관리
└── prompts/              # AI 프롬프트 템플릿
```

## 팀 멤버

- **Hwan Choe** - Backend Developer
- **Seojin An** - Frontend Engineer / UXUI Designer
- **Yunje Na** - Team Leader / Prompt Engineer
- **Seungmin Oh** - Prompt Engineer
- **Sebin Hwang** - Business Development Manager

## 프론트엔드

프론트엔드 코드는 별도 레포지토리에서 관리됩니다:
- [msp-frontend](https://github.com/MSP-MoonSunPower/msp-frontend)

## 라이센스

MIT License

 