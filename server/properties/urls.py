from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, InquiryViewSet, create_property_simple, my_favorites, my_properties

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'inquiries', InquiryViewSet, basename='inquiry')
#router.register(r'saved-searches', SavedSearchViewSet, basename='savedsearch')

urlpatterns = [
    path('', include(router.urls)),
    path('create/', create_property_simple, name='create-property'),
    path('my_properties/', my_properties, name='my-properties'),
    path('my_favorites/', my_favorites, name='my-favorites'),
]