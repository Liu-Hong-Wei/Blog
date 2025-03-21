from django.shortcuts import render
from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer
from django.views.generic import TemplateView

# Create your views here.
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

# Add this view to handle React routing
class ReactAppView(TemplateView):
    template_name = 'index.html'