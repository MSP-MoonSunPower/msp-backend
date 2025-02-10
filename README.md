# Moon Sun Power ✨

Welcome to MoonSunPower Hub!🌙☀️ <br/>
Since 2024.09, Team MSP is actively driving the project forward with great enthusiasm! 🚀<br/>
Moon Sun Power is an AI-powered personalized language learning platform designed to improve reading and comprehension skills efficiently.<br/>
<br/>

![Moon Sun Power Preview](frontend/src/assets/aboutMSP.gif)


🌐 [**Click here**](https://moonsunpower.com) to explore our platform! 🚀 <br/>
⏳ Choose the topic and difficulty of the passage, and a personalized passage with questions will be generated for you in just 1 minute! 📝✨


---

## TEAM MSP ✨

| Members | About Us | Members | About Us |
|:------------:|:----------|:------------:|:----------|
| <img src="frontend/src/assets/hwan.jpg" alt="Hwan Choe" width="120"> <br/> **Hwan Choe** | [@acupoframen](https://github.com/acupoframen) <br/> Team Leader / Backend Developer <br/> 서강대학교 유럽문화학과 & 컴퓨터공학과 19 | <img src="frontend/src/assets/sj.jpg" alt="Seojin An" width="120"> <br/> **Seojin An** | [@xxj15](https://github.com/xxj15) <br/> Frontend Engineer / UXUI Designer <br/> 서강대학교 유럽문화학과 & 컴퓨터공학과 20 |
| <img src="frontend/src/assets/seungmin.png" alt="Seungmin Oh" width="120"> <br/> **Seungmin Oh** | [@5zum](https://github.com/5zum) <br/> Prompt Engineer <br/> 서강대학교 유럽문화학과 & 경영학과 21 | <img src="frontend/src/assets/yj.jpg" alt="Yunje Na" width="120"> <br/> **Yunje Na** | [@YunJe-Na](https://github.com/YunJe-Na) <br/> Prompt Engineer <br/> 서강대학교 유럽문화학과 & 경영학과 21 |
| <img src="frontend/src/assets/sebin.jpg" alt="Sebin Hwang" width="120"> <br/> **Sebin Hwang** | [@sebinHwang](https://github.com/sebinHwang) <br/> Business Development Manager <br/> 서강대학교 유럽문화학과 & 경영학과 21 | | |

---

## 프로젝트 소개

### 문제 제기
4차 산업혁명 시대의 기술 발전으로 정보 수집이 쉬워졌지만, 이로 인해 ‘문해력 저하’ 문제가 심화되고 있다. 영상 매체와 짧은 글로 정보가 전달되면서 문해력 부족 현상이 발생하고 있다. 이에 따라 사용자의 문해력을 향상시킬 수 있는 새로운 프로그램이 필요하다는 문제 제기가 이루어졌다.

### 과제 목적
‘Moon, Sun, Power’ 프로그램은 디지털 시대의 문해력 문제를 해결하는 것을 목표로 한다. 기존의 반복적이고 형식적인 프로그램과 차별화되며, AI 기반 맞춤형 학습 지문을 제공한다. 사용자가 원하는 주제나 난이도를 선택할 수 있어, 문해력뿐 아니라 어휘력과 사고 능력도 함께 향상시킬 수 있다.

### 지역 연계
서울특별시교육청 등과 협력하여, 서울시 내 학생과 성인들에게 문해력 향상 프로그램을 제공할 계획이다. 웹 기반의 AI 맞춤형 학습 지문 생성 시스템으로 다양한 연령대와 사회 계층에 맞춘 학습 콘텐츠를 제공하며, 지역사회 내 문해력 격차 해소에 기여하고자 한다.

---

## Stacks

### Backend
<img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" style="margin-right: 3px
;">
<img src="https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white" style="margin-right: 3px
;">
<img src="https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=redis&logoColor=white" style="margin-right: 3px
;">
<img src="https://img.shields.io/badge/gunicorn-499848?style=for-the-badge&logo=Gunicorn&logoColor=white" style="margin-right: 3px
;">
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" style="margin-right: 3px
;">

### Deployment
<img src="https://img.shields.io/badge/AWS EC2-FF9900?style=for-the-badge&logo=Amazon EC2&logoColor=white" style="margin-right: 3px;">
<img src="https://img.shields.io/badge/Amazon rds-527FFF?style=for-the-badge&logo=Amazon RDS&logoColor=white" style="margin-right: 3px;">
<img src="https://img.shields.io/badge/AWS Route 53-8C4FFF?style=for-the-badge&logo=Amazon route 53&logoColor=white" style="margin-right: 3px;">
<img src="https://img.shields.io/badge/AWS CloudWatch-FF4F8B?style=for-the-badge&logo=Amazon CloudWatch&logoColor=white">


---



## 아키텍처

# 패치 목록

### Amsterdam Schipol (~2024.12.06)
v1.1.0:
- New!:
    - About Us Page
    - Google Analytics Tag Implementation
    
- Fix: 
    - Prompts Improvement (Less Hallucination, faster generate speed, accepts wider variety of topics)
    - Better UI

v1.0.0: Creation of MoonSunPower!
- New!: 
    - HomePage Implementation
    - Select Page Implementation
    - Question.js Implementation
    - Solution Page Implementation
    - Basic Prompt settings for creating Text / Questions / Word Definitions
