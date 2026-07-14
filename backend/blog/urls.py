from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, TagViewSet, AboutViewSet, IdeaViewSet
from .link_preview import link_preview_api

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'tags', TagViewSet)
router.register(r'ideas', IdeaViewSet)
router.register(r'about', AboutViewSet)

urlpatterns = router.urls + [
    path('link-preview/', link_preview_api),
]
# path('', include(router.urls)),