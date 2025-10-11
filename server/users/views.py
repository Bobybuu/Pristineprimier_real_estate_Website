# users/views.py
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
import json

from .models import User, UserProfile, SellerApplication
from .serializers import UserSerializer
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                login(request, user)
                return JsonResponse({
                    'success': True,
                    'user': UserSerializer.serialize(user),
                    'message': 'Login successful'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            
            # Check if user already exists
            if User.objects.filter(username=data.get('username')).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Username already exists'
                }, status=400)
                
            if User.objects.filter(email=data.get('email')).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Email already exists'
                }, status=400)
            
            # Create user
            user = User.objects.create_user(
                username=data.get('username'),
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                user_type=data.get('user_type', 'buyer'),
                phone_number=data.get('phone_number', '')
            )
            
            # Create user profile
            UserProfile.objects.create(user=user)
            
            # If seller, create application
            if data.get('user_type') == 'seller':
                SellerApplication.objects.create(
                    user=user,
                    application_data=data
                )
            
            login(request, user)
            
            return JsonResponse({
                'success': True,
                'user': UserSerializer.serialize(user),
                'message': 'Registration successful'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(View):
    @method_decorator(csrf_protect)
    def post(self, request):
        logout(request)
        return JsonResponse({
            'success': True,
            'message': 'Logout successful'
        })

class CurrentUserView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({
                'success': True,
                'user': UserSerializer.serialize(request.user)
            })
        else:
            return JsonResponse({
                'success': False,
                'user': None
            })

class SellerApplicationView(View):
    @method_decorator(login_required)
    def post(self, request):
        try:
            data = json.loads(request.body)
            
            # Check if user already has a pending application
            pending_app = SellerApplication.objects.filter(
                user=request.user, 
                status='pending'
            ).exists()
            
            if pending_app:
                return JsonResponse({
                    'success': False,
                    'message': 'You already have a pending application'
                }, status=400)
            
            application = SellerApplication.objects.create(
                user=request.user,
                application_data=data
            )
            
            # Update user type to seller (pending approval)
            request.user.user_type = 'seller'
            request.user.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Application submitted successfully',
                'application_id': application.id
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)
            
            
# users/views.py - Add this to the bottom of the file

class CSRFTestView(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return JsonResponse({
            'message': 'CSRF cookie set',
            'has_csrf_cookie': 'csrftoken' in request.COOKIES
        })
    
    @method_decorator(csrf_protect)
    def post(self, request):
        return JsonResponse({
            'message': 'CSRF protection working!'
        })