from django.urls import path
from .views import ActivityPingView, ActivityStatusView

urlpatterns = [
    path('ping/', ActivityPingView.as_view(), name='activity-ping'),
    path('status/', ActivityStatusView.as_view(), name='activity-status'),
]
