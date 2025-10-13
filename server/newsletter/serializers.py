from rest_framework import serializers
from .models import NewsletterSubscriber, PopupDismissal

class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']
    
    def validate_email(self, value):
        # Check if email is already subscribed and active
        if NewsletterSubscriber.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError("This email is already subscribed to our newsletter.")
        return value

class PopupDismissalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PopupDismissal
        fields = ['session_key', 'user']

class NewsletterUnsubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField()