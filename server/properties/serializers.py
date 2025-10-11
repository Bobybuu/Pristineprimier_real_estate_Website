from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Property, PropertyImage, Favorite, Inquiry, SavedSearch

# This will automatically use your custom User model from settings.AUTH_USER_MODEL
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'caption', 'is_primary', 'order']

class PropertyListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'property_type', 'price', 'price_unit', 
            'city', 'state', 'bedrooms', 'bathrooms', 'square_feet',
            'primary_image', 'is_favorited', 'status', 'featured'
        ]
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return PropertyImageSerializer(primary_image).data
        first_image = obj.images.first()
        if first_image:
            return PropertyImageSerializer(first_image).data
        return None
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False

class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    seller = UserSerializer(read_only=True)
    agent = UserSerializer(read_only=True)
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'property_type', 'status',
            'address', 'city', 'state', 'zip_code', 'latitude', 'longitude',
            'price', 'price_unit', 'bedrooms', 'bathrooms', 'square_feet',
            'lot_size', 'year_built', 'has_garage', 'has_pool', 'has_garden',
            'has_fireplace', 'has_central_air', 'seller', 'agent', 'images',
            'is_favorited', 'featured', 'views_count', 'created_at', 'published_at'
        ]

class FavoriteSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'property', 'created_at']

class InquirySerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)
    
    class Meta:
        model = Inquiry
        fields = [
            'id', 'property', 'property_title', 'name', 'email', 'phone',
            'message', 'inquiry_type', 'preferred_date', 'status', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']

class SavedSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedSearch
        fields = ['id', 'name', 'search_params', 'is_active', 'created_at']
        read_only_fields = ['user']