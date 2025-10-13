from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import NewsletterSubscriber, PopupDismissal
from .serializers import NewsletterSubscriptionSerializer, PopupDismissalSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_newsletter(request):
    """Subscribe to newsletter"""
    serializer = NewsletterSubscriptionSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        # Check if email exists but is inactive (resubscribe)
        existing_subscriber = NewsletterSubscriber.objects.filter(email=email).first()
        
        if existing_subscriber:
            existing_subscriber.is_active = True
            existing_subscriber.unsubscribed_at = None
            if request.user.is_authenticated:
                existing_subscriber.user = request.user
            existing_subscriber.save()
        else:
            # Create new subscriber
            subscriber = NewsletterSubscriber(
                email=email,
                user=request.user if request.user.is_authenticated else None
            )
            subscriber.save()
        
        return Response({
            'success': True,
            'message': 'Successfully subscribed to our newsletter!'
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def dismiss_popup(request):
    """Dismiss newsletter popup for 3 days"""
    session_key = request.data.get('session_key')
    
    if not session_key:
        return Response({
            'success': False,
            'message': 'Session key is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create or update dismissal record
    dismissal, created = PopupDismissal.objects.update_or_create(
        session_key=session_key,
        user=request.user if request.user.is_authenticated else None,
        defaults={'dismissed_at': timezone.now()}
    )
    
    return Response({
        'success': True,
        'message': 'Popup dismissed for 3 days'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def check_popup_status(request):
    """Check if popup should be shown"""
    session_key = request.GET.get('session_key')
    
    if not session_key:
        return Response({
            'show_popup': True,
            'message': 'No session key provided'
        })
    
    # Check for valid dismissal
    dismissal = PopupDismissal.objects.filter(
        session_key=session_key,
        user=request.user if request.user.is_authenticated else None
    ).first()
    
    if dismissal and dismissal.is_valid():
        show_popup = False
    else:
        show_popup = True
    
    return Response({
        'show_popup': show_popup,
        'dismissed_at': dismissal.dismissed_at.isoformat() if dismissal else None
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def unsubscribe_newsletter(request):
    """Unsubscribe from newsletter"""
    email = request.data.get('email')
    
    if not email:
        return Response({
            'success': False,
            'message': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        subscriber = NewsletterSubscriber.objects.get(email=email, is_active=True)
        subscriber.is_active = False
        subscriber.unsubscribed_at = timezone.now()
        subscriber.save()
        
        return Response({
            'success': True,
            'message': 'Successfully unsubscribed from newsletter'
        })
    
    except NewsletterSubscriber.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Email not found in our subscription list'
        }, status=status.HTTP_404_NOT_FOUND)

# Django view for backward compatibility
@csrf_exempt
def newsletter_subscribe_legacy(request):
    """Legacy endpoint for form submissions"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            if not email:
                return JsonResponse({
                    'success': False,
                    'message': 'Email is required'
                }, status=400)
            
            # Use the same logic as API view
            existing_subscriber = NewsletterSubscriber.objects.filter(email=email).first()
            
            if existing_subscriber:
                existing_subscriber.is_active = True
                existing_subscriber.unsubscribed_at = None
                existing_subscriber.save()
            else:
                NewsletterSubscriber.objects.create(email=email)
            
            return JsonResponse({
                'success': True,
                'message': 'Successfully subscribed to newsletter!'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)