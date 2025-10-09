from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import Post, Tag, About
from .serializers import PostSerializer, TagSerializer, AboutSerializer
from django.views.generic import TemplateView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# Create your views here.
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'title']
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=["views"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_tag(self, request):
        tag_slug = request.query_params.get('tag', None)
        if tag_slug:
            try:
                tag = Tag.objects.get(slug=tag_slug)
                posts = Post.objects.filter(post_tags__tag=tag)
                serializer = self.get_serializer(posts, many=True)
                return Response(serializer.data)
            except Tag.DoesNotExist:
                return Response({"error": "Tag not found"}, status=404)
        return Response({"error": "Tag parameter is required"}, status=400)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'

class AboutViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = About.objects.all()
    serializer_class = AboutSerializer

# Add this view to handle React routing
class ReactAppView(TemplateView):
    template_name = 'index.html'