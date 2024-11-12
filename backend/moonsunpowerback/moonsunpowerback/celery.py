# moonsunpowerback/celery.py
import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'moonsunpowerback.settings')
app = Celery('moonsunpowerback')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'generate-and-save-text-every-5-minutes': {
        'task': 'moonsunpowerai.tasks.generate_and_save_text',
        # 'schedule': crontab(hour=0, minute=0),  # 매일 자정에 실행
        # 'options': {'timezone': 'Asia/Seoul'},  # 한국 시간 기준
        'schedule': crontab(minute='*/2'),  # Runs every 2 minutes
        'options': {'timezone': 'Asia/Seoul'},  # Korean time zone
    },
}
app.conf.worker_pool = 'solo'