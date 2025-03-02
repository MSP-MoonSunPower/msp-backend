from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from django.conf import settings
from django.conf.urls.static import static


schema_view = get_schema_view(
    openapi.Info(
        title="Today Text API",
        default_version='v1',
        description="API for generating and fetching today's text",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    
    path('bananashark/', admin.site.urls),
    path('ai/', include('moonsunpowerai.urls')),
    path('user/',include('accounts.urls')),
    # Swagger UI
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # ReDoc (alternative UI)
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


