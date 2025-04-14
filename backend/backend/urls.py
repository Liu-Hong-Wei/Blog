"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from django.conf import settings
from django.conf.urls.static import static

# Import REACT_APP_DIR from settings
from .settings import REACT_APP_DIR

urlpatterns = [
    path('admin/', admin.site.urls),
    # API routes 
    path('api/', include('blog.urls')),
    # Serve React frontend at root URL
    path('', never_cache(TemplateView.as_view(template_name='index.html'))),
    # Catch all non-matched routes
    path('<path:path>', never_cache(TemplateView.as_view(template_name='index.html'))),
]

if settings.DEBUG:
    urlpatterns = [
        # Serve static files first
        *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
        *static('/assets/', document_root=REACT_APP_DIR / 'assets'),
        *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
        *urlpatterns
    ]
