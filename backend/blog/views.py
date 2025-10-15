from rest_framework import viewsets, filters
from .models import Post, Tag, About
from .serializers import PostSerializer, TagSerializer, AboutSerializer
from rest_framework.response import Response
from django.db.models import F

# Create your views here.
class PostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'tags__name']
    ordering_fields = ['created_at', 'title', 'views']
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Use F() expression to avoid race conditions
        instance.views = F('views') + 1
        instance.save(update_fields=["views"])
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        tag_slug = self.request.query_params.get('tag', None)
        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)
        return queryset

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'

class AboutViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = About.objects.all()
    serializer_class = AboutSerializer
