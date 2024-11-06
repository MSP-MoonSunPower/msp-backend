from django.db import models
from django.utils import timezone

# 개별 질문 항목 모델
class QuestionItem(models.Model):
    text = models.ForeignKey('Text', on_delete=models.CASCADE, related_name="question_items", null=True, blank=True)
    generated_text = models.ForeignKey('GeneratedText', on_delete=models.CASCADE, related_name="question_items", null=True, blank=True)
    question_text = models.TextField()        # 질문 내용
    choice1 = models.CharField(max_length=255)  # 첫 번째 선택지
    choice2 = models.CharField(max_length=255)  # 두 번째 선택지
    choice3 = models.CharField(max_length=255)  # 세 번째 선택지
    choice4 = models.CharField(max_length=255)  # 네 번째 선택지
    choice5= models.CharField(max_length=255)  # 다섯 번째 선택지
    answer = models.IntegerField(
        choices=[(1, "Choice 1"), (2, "Choice 2"), (3, "Choice 3"), (4, "Choice 4"),(5, "Choice 5")],
        help_text="Enter the correct choice number (1 to 5)"
    )
    explanation = models.TextField()          # 해설

    def __str__(self):
        if self.text:
            return f"Question {self.id} for Text {self.text.id}"
        elif self.generated_text:
            return f"Question {self.id} for GeneratedText {self.generated_text.id}"
        return f"Question {self.id}"

    def get_correct_answer_text(self):
        """정답 텍스트를 반환하는 메서드"""
        return getattr(self, f"choice{self.answer}", "No correct answer set")


# 매일 자동 생성되는 텍스트 모델
class GeneratedText(models.Model):
    subject = models.CharField(max_length=255,null=True,default="")  
    date = models.DateTimeField(default=timezone.now)  # 생성된 날짜
    content = models.TextField()                       # 생성된 텍스트 내용
    created_at = models.DateTimeField(auto_now_add=True)  # 생성된 날짜와 시간

    def __str__(self):
        return f"Generated Text {self.id} - {self.date.strftime('%Y-%m-%d')}"


# 사용자가 요청한 주제 기반의 텍스트 모델
class Text(models.Model):
    subject = models.CharField(max_length=255,null=True,default="")  
    difficulty=models.IntegerField(null=True, default=3)
    date = models.DateTimeField(default=timezone.now)  # 생성된 날짜
    content = models.TextField()                       # 생성된 텍스트 내용
    created_at = models.DateTimeField(auto_now_add=True)  # 생성된 날짜와 시간

    def __str__(self):
        return f"User Generated Text {self.id} - {self.date.strftime('%Y-%m-%d')}"
