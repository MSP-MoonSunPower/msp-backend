# moonsunpowerback/celery.py
import os
from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'moonsunpowerback.settings')
app = Celery('moonsunpowerback')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# app.conf.beat_schedule = {
#     'run_shared_task_midnight': {
#         'task': 'moonsunpowerai.generate_and_save_text',  # 실제 task의 이름으로 변경
#         'schedule': 86400.0,  # 24시간마다 실행
#         'options': {'timezone': 'Asia/Seoul'},  # timezone 설정 (UTC, Asia/Seoul 등)
#     },
# }
app.conf.beat_schedule = {
    'generate-and-save-text-every-5-minutes': {
        'task': 'moonsunpowerai.tasks.generate_and_save_text',
        'schedule': 300.0,  # 300초 = 5분
    },
}
app.conf.worker_pool = 'solo'