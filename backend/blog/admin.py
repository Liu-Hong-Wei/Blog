from django.contrib import admin
from .models import Post, Tag, About, Idea

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'created_at', 'is_published', 'views')
    list_filter = ('is_published', 'created_at')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Idea)
class IdeaAdmin(admin.ModelAdmin):
    list_display = ('content_summary', 'created_at', 'is_published')
    list_filter = ('is_published', 'created_at')
    search_fields = ('content',)
    date_hierarchy = 'created_at'

    def content_summary(self, obj):
        if len(obj.content) > 50:
            return obj.content[:50] + '...'
        return obj.content
    content_summary.short_description = 'Content'


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ('title', 'updated_at')

