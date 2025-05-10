from rest_framework import serializers
from .models import Post, Tag, PostTag, About
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = '__all__'
    
    def get_tags(self, obj):
        post_tags = PostTag.objects.filter(post=obj)
        return TagSerializer(
            [post_tag.tag for post_tag in post_tags], 
            many=True
        ).data

class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = '__all__'
