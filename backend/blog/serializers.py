from rest_framework import serializers
from .models import Post, Tag, About, Idea

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class PostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    views = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'tldr', 'created_at', 'updated_at', 'is_published', 'slug', 'views', 'tags']
        read_only_fields = ['created_at', 'updated_at', 'views']

class IdeaSerializer(serializers.ModelSerializer):
    images = serializers.SlugRelatedField(many=True, read_only=True, slug_field='url')

    class Meta:
        model = Idea
        fields = ['id', 'content', 'images', 'created_at', 'updated_at', 'is_published']


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = ['id', 'title', 'content', 'updated_at']
        read_only_fields = ['updated_at']

