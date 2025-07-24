from django.db import models
from django.conf import settings

class DailyLogin(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()

    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date']
