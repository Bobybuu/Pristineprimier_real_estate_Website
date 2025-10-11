# users/serializers.py
from django.contrib.auth import get_user_model
# In users/serializers.py, if needed:
from .models import UserProfile

User = get_user_model()

class UserProfileSerializer:
    @staticmethod
    def serialize(profile):
        if not profile:
            return {}
        return {
            'address': profile.address,
            'city': profile.city,
            'state': profile.state,
            'zip_code': profile.zip_code,
            'country': profile.country,
            'email_notifications': profile.email_notifications,
            'sms_notifications': profile.sms_notifications,
            'preferred_locations': profile.preferred_locations,
            'price_range_min': str(profile.price_range_min) if profile.price_range_min else None,
            'price_range_max': str(profile.price_range_max) if profile.price_range_max else None,
            'preferred_property_types': profile.preferred_property_types,
        }

class UserSerializer:
    @staticmethod
    def serialize(user):
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'user_type': user.user_type,
            'phone_number': user.phone_number,
            'is_verified': user.is_verified,
            'company_name': user.company_name,
            'license_number': user.license_number,
            'bio': user.bio,
            'date_joined': user.date_joined.isoformat(),
        }
        
        # Add profile data if exists
        try:
            data['profile'] = UserProfileSerializer.serialize(user.profile)
        except User.profile.RelatedObjectDoesNotExist:
            data['profile'] = {}
        
        return data