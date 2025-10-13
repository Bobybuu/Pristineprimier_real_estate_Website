# properties/admin.py
from django.contrib import admin
from .models import Property, PropertyImage, Favorite, Inquiry

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ['image', 'caption', 'is_primary', 'order']

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['title', 'property_type', 'price', 'city', 'state', 'status', 'featured', 'created_at']
    list_filter = ['property_type', 'status', 'featured', 'city', 'state', 'created_at']
    search_fields = ['title', 'address', 'city', 'state', 'description', 'seller__username', 'seller__email']
    readonly_fields = ['created_at', 'updated_at', 'published_at', 'views_count']
    list_editable = ['status', 'featured']
    inlines = [PropertyImageInline]
    actions = ['make_published', 'make_featured', 'make_draft']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'property_type', 'status')
        }),
        ('Location', {
            'fields': ('address', 'city', 'state', 'zip_code', 'latitude', 'longitude')
        }),
        ('Pricing', {
            'fields': ('price', 'price_unit')
        }),
        ('Property Details', {
            'fields': ('bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built')
        }),
        ('Amenities', {
            'fields': ('has_garage', 'has_pool', 'has_garden', 'has_fireplace', 'has_central_air')
        }),
        ('Relationships', {
            'fields': ('seller', 'agent')
        }),
        ('Metadata', {
            'fields': ('featured', 'views_count', 'created_at', 'updated_at', 'published_at')
        }),
    )
    
    def make_published(self, request, queryset):
        updated = queryset.update(status='published')
        self.message_user(request, f'{updated} properties marked as published.')
    make_published.short_description = "Mark selected properties as published"
    
    def make_featured(self, request, queryset):
        updated = queryset.update(featured=True)
        self.message_user(request, f'{updated} properties marked as featured.')
    make_featured.short_description = "Mark selected properties as featured"
    
    def make_draft(self, request, queryset):
        updated = queryset.update(status='draft')
        self.message_user(request, f'{updated} properties marked as draft.')
    make_draft.short_description = "Mark selected properties as draft"

@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ['property', 'image_preview', 'is_primary', 'order']
    list_filter = ['is_primary']
    list_editable = ['is_primary', 'order']
    search_fields = ['property__title', 'caption']
    
    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="width: 50px; height: 50px; object-fit: cover;" />'
        return "No Image"
    image_preview.allow_tags = True
    image_preview.short_description = 'Preview'

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'property', 'property_city', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'user__email', 'property__title', 'property__city']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    def property_city(self, obj):
        return obj.property.city
    property_city.short_description = 'Property City'

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ['property', 'name', 'email', 'inquiry_type', 'status', 'created_at']
    list_filter = ['inquiry_type', 'status', 'created_at']
    search_fields = ['name', 'email', 'phone', 'property__title', 'message']
    readonly_fields = ['created_at']
    list_editable = ['status']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Inquiry Details', {
            'fields': ('property', 'user', 'name', 'email', 'phone', 'message')
        }),
        ('Inquiry Type & Status', {
            'fields': ('inquiry_type', 'preferred_date', 'status')
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )

