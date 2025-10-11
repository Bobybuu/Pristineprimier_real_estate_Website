from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Property, PropertyImage, Favorite, Inquiry, SavedSearch
from .serializers import (
    PropertyListSerializer, PropertyDetailSerializer, 
    FavoriteSerializer, InquirySerializer, SavedSearchSerializer
)
from .filters import PropertyFilter

class PropertyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['title', 'description', 'address', 'city', 'state']
    ordering_fields = ['price', 'created_at', 'square_feet', 'bedrooms']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Property.objects.filter(status='published')
        
        # Handle featured filter manually if needed
        featured_param = self.request.query_params.get('featured')
        if featured_param:
            if featured_param.lower() == 'true':
                queryset = queryset.filter(featured=True)
            elif featured_param.lower() == 'false':
                queryset = queryset.filter(featured=False)
        
        # Sellers can see their own draft/pending properties
        if self.request.user.is_authenticated:
            if self.action in ['list', 'retrieve']:
                # For public endpoints, only show published properties
                pass
            else:
                # For other actions, sellers can see their own properties
                user_properties = Property.objects.filter(seller=self.request.user)
                queryset = queryset | user_properties
        
        return queryset.distinct()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PropertyListSerializer
        return PropertyDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    
    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        property = self.get_object()
        favorite, created = Favorite.objects.get_or_create(
            user=request.user, 
            property=property
        )
        
        if created:
            return Response({'status': 'added to favorites'}, status=status.HTTP_201_CREATED)
        else:
            favorite.delete()
            return Response({'status': 'removed from favorites'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def my_favorites(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_properties(self, request):
        properties = Property.objects.filter(seller=request.user)
        serializer = self.get_serializer(properties, many=True)
        return Response(serializer.data)

class InquiryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InquirySerializer
    
    def get_queryset(self):
        return Inquiry.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedSearchViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SavedSearchSerializer
    
    def get_queryset(self):
        return SavedSearch.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)