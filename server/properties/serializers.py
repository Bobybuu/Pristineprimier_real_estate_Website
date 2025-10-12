# properties/serializers.py
from rest_framework import serializers
from .models import Property, PropertyImage, Favorite, Inquiry

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'caption', 'is_primary', 'order']

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    seller_name = serializers.CharField(source='seller.get_full_name', read_only=True)
    
    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ['seller', 'created_at', 'updated_at', 'published_at', 'views_count']

class PropertyListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    seller_name = serializers.CharField(source='seller.get_full_name', read_only=True)
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'property_type', 'status', 'price', 'price_unit',
            'bedrooms', 'bathrooms', 'square_feet', 'city', 'state',
            'primary_image', 'seller_name', 'created_at', 'featured'
        ]
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image.url
        return None

class PropertyDetailSerializer(PropertySerializer):
    # Extends PropertySerializer with additional fields if needed
    pass

class FavoriteSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_price = serializers.DecimalField(source='property.price', read_only=True, max_digits=12, decimal_places=2)
    property_city = serializers.CharField(source='property.city', read_only=True)
    property_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Favorite
        fields = [
            'id', 'property', 'property_title', 'property_price', 
            'property_city', 'property_image', 'created_at'
        ]
    
    def get_property_image(self, obj):
        primary_image = obj.property.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image.url
        return None


# properties/serializers.py - SIMPLIFIED VERSION
class InquirySerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True, allow_null=True)
    
    class Meta:
        model = Inquiry
        fields = [
            'id', 'property', 'property_title', 'name', 'email', 'phone',
            'message', 'inquiry_type', 'preferred_date', 'status', 'created_at'
        ]
        read_only_fields = ['user', 'created_at', 'status']
    
    def create(self, validated_data):
        # For public inquiries, user is None
        # For authenticated users, this won't be called from public_inquiry
        return Inquiry.objects.create(**validated_data)