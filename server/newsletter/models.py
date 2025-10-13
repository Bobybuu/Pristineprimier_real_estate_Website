from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'newsletter_subscribers'
    
    def __str__(self):
        return self.email

class PopupDismissal(models.Model):
    session_key = models.CharField(max_length=255, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    dismissed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'popup_dismissals'
        unique_together = ['session_key', 'user']
    
    def is_valid(self):
        """Check if dismissal is still valid (within 3 days)"""
        return (timezone.now() - self.dismissed_at).days < 3

class NewsletterCampaign(models.Model):
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=200)
    content = models.TextField()
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'newsletter_campaigns'
    
    def __str__(self):
        return self.title