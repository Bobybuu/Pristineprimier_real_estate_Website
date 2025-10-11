
import django_filters
from .models import Property

class PropertyFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    property_type = django_filters.MultipleChoiceFilter(choices=Property.PROPERTY_TYPES)
    city = django_filters.CharFilter(field_name='city', lookup_expr='icontains')
    state = django_filters.CharFilter(field_name='state', lookup_expr='icontains')
    min_bedrooms = django_filters.NumberFilter(field_name='bedrooms', lookup_expr='gte')
    min_bathrooms = django_filters.NumberFilter(field_name='bathrooms', lookup_expr='gte')
    min_square_feet = django_filters.NumberFilter(field_name='square_feet', lookup_expr='gte')
    has_garage = django_filters.BooleanFilter(field_name='has_garage')
    has_pool = django_filters.BooleanFilter(field_name='has_pool')
    has_garden = django_filters.BooleanFilter(field_name='has_garden')
    
    # Add featured filter
    featured = django_filters.BooleanFilter(field_name='featured')
    
    class Meta:
        model = Property
        fields = {
            'property_type': ['exact'],
            'city': ['exact'],
            'state': ['exact'],
            'status': ['exact'],  # Make sure status filter works too
        }