from django.urls import path

from server.newsletter import admin_dashboard
from . import views

urlpatterns = [
    path('api/subscribe/', views.subscribe_newsletter, name='newsletter-subscribe'),
    path('api/unsubscribe/', views.unsubscribe_newsletter, name='newsletter-unsubscribe'),
    path('api/popup/dismiss/', views.dismiss_popup, name='popup-dismiss'),
    path('api/popup/status/', views.check_popup_status, name='popup-status'),
    path('subscribe/', views.newsletter_subscribe_legacy, name='newsletter-subscribe-legacy'),
    path('admin/dashboard/', admin_dashboard.newsletter_dashboard, name='newsletter-dashboard'),
]