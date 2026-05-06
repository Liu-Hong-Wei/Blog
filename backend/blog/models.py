from django.db import models
from django.utils import timezone
from django.utils.text import slugify

# Create your models here.

class Post(models.Model):  
    title = models.CharField(max_length=200) 
    content = models.TextField()  
    created_at = models.DateTimeField(default=timezone.now, help_text='可手动修改')
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    slug = models.SlugField(max_length=250, unique=True)
    views = models.PositiveIntegerField(default=0)
    tldr = models.CharField(max_length=500, blank=True, null=True, help_text="A short summary of the post.")
    tags = models.ManyToManyField('Tag', related_name='posts', blank=True)
    
    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Idea(models.Model):
    content = models.TextField(help_text="支持 Markdown，可嵌入图片链接")
    created_at = models.DateTimeField(default=timezone.now, help_text="可手动修改")
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        if len(self.content) > 30:
            return self.content[:30] + '...'
        return self.content

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Idea'
        verbose_name_plural = 'Ideas'


class About(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = 'About'

