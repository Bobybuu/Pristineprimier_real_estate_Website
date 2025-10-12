# properties/views.py
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from .models import Property, PropertyImage, Favorite, Inquiry
from .serializers import (
    PropertyListSerializer, PropertyDetailSerializer, 
    FavoriteSerializer, InquirySerializer, PropertySerializer
)
@method_decorator(csrf_exempt, name='dispatch')
class PropertyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'address', 'city', 'state']
    ordering_fields = ['price', 'created_at', 'square_feet', 'bedrooms']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Property.objects.all()
        
        # For public endpoints, only show published properties
        if self.action in ['list', 'retrieve']:
            queryset = queryset.filter(status='published')
        
        # Handle featured filter
        featured_param = self.request.query_params.get('featured')
        if featured_param:
            if featured_param.lower() == 'true':
                queryset = queryset.filter(featured=True)
            elif featured_param.lower() == 'false':
                queryset = queryset.filter(featured=False)
        
        # Sellers can see their own draft/pending properties in non-public actions
        if self.request.user.is_authenticated and self.action not in ['list', 'retrieve']:
            user_properties = Property.objects.filter(seller=self.request.user)
            queryset = queryset | user_properties
        
        return queryset.distinct()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PropertyListSerializer
        elif self.action == 'create':
            return PropertySerializer  # Use PropertySerializer for creation
        elif self.action in ['update', 'partial_update']:
            return PropertySerializer  # Use PropertySerializer for updates
        return PropertyDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
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
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_favorites(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_properties(self, request):
        properties = Property.objects.filter(seller=request.user)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def inquire(self, request, pk=None):
        property = self.get_object()
        serializer = InquirySerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                user=request.user,
                property=property
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InquiryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InquirySerializer
    
    def get_queryset(self):
        return Inquiry.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_properties(request):
    """Get properties created by the current user"""
    properties = Property.objects.filter(seller=request.user)
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_favorites(request):
    """Get user's favorite properties"""
    favorites = Favorite.objects.filter(user=request.user).select_related('property')
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data)

# Simple property creation endpoint for testing
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def create_property_simple(request):
    """Simple property creation endpoint"""
    try:
        # Create property without images first
        property_data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'property_type': request.data.get('property_type'),
            'status': request.data.get('status', 'draft'),
            'address': request.data.get('address'),
            'city': request.data.get('city'),
            'state': request.data.get('state'),
            'zip_code': request.data.get('zip_code'),
            'price': request.data.get('price'),
            'price_unit': request.data.get('price_unit', 'total'),
            'bedrooms': request.data.get('bedrooms'),
            'bathrooms': request.data.get('bathrooms'),
            'square_feet': request.data.get('square_feet'),
            'lot_size': request.data.get('lot_size'),
            'year_built': request.data.get('year_built'),
            'has_garage': request.data.get('has_garage', False),
            'has_pool': request.data.get('has_pool', False),
            'has_garden': request.data.get('has_garden', False),
            'has_fireplace': request.data.get('has_fireplace', False),
            'has_central_air': request.data.get('has_central_air', False),
            'featured': request.data.get('featured', False),
        }
        
        # Remove None values
        property_data = {k: v for k, v in property_data.items() if v is not None}
        
        serializer = PropertySerializer(data=property_data)
        if serializer.is_valid():
            property = serializer.save(seller=request.user)
            
            # Handle image uploads if any
            images = request.FILES.getlist('images')
            for i, image_file in enumerate(images):
                PropertyImage.objects.create(
                    property=property,
                    image=image_file,
                    caption=request.data.get(f'image_captions[{i}]', ''),
                    is_primary=request.data.get(f'image_is_primary[{i}]', 'false').lower() == 'true',
                    order=i
                )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# properties/views.py 
@api_view(['POST'])
@permission_classes([AllowAny])
def public_inquiry(request):
    """
    Public inquiry endpoint that doesn't require authentication
    """
    try:
        # Create a modified data dict for the serializer
        inquiry_data = {
            'name': request.data.get('name'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'message': request.data.get('message'),
            'inquiry_type': request.data.get('inquiry_type', 'general_inquiry'),
        }
        
        # Handle property association if provided
        property_id = request.data.get('property')
        if property_id:
            try:
                property_obj = Property.objects.get(id=property_id)
                inquiry_data['property'] = property_obj.id
            except Property.DoesNotExist:
                # Property not found, but still proceed with inquiry
                pass
        inquiry = Inquiry.objects.create(
            name=inquiry_data['name'],
            email=inquiry_data['email'],
            phone=inquiry_data['phone'],
            message=inquiry_data['message'],
            inquiry_type=inquiry_data['inquiry_type'],
            user=None,  # Public inquiry
            property_id=inquiry_data.get('property')  # Can be None
        )    
        
        serializer = InquirySerializer(data=inquiry_data)
        
        if serializer.is_valid():
            # For public inquiries, user will be None
            inquiry = serializer.save(user=None)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )