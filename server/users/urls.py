# users/urls.py
from django.urls import path
from django.http import JsonResponse
from django.middleware.csrf import get_token
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.CurrentUserView.as_view(), name='current_user'),
    path('csrf/', lambda request: JsonResponse({'csrfToken': get_token(request)})),
    path('seller/apply/', views.SellerApplicationView.as_view(), name='seller_apply'),
    #path('csrf-test/', views.CSRFTestView.as_view(), name='csrf_test'),
]