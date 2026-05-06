from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, TagViewSet, AboutViewSet, IdeaViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'tags', TagViewSet)
router.register(r'ideas', IdeaViewSet)
router.register(r'about', AboutViewSet)

urlpatterns = router.urls
# path('', include(router.urls)),