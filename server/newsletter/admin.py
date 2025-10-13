from django.contrib import admin
from .models import NewsletterSubscriber, PopupDismissal, NewsletterCampaign

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'user', 'is_active', 'subscribed_at', 'unsubscribed_at')
    list_filter = ('is_active', 'subscribed_at', 'unsubscribed_at')
    search_fields = ('email', 'user__username', 'user__email')
    readonly_fields = ('subscribed_at', 'unsubscribed_at')
    actions = ['activate_subscribers', 'deactivate_subscribers']
    
    fieldsets = (
        ('Subscriber Information', {
            'fields': ('email', 'user', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('subscribed_at', 'unsubscribed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def activate_subscribers(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} subscribers activated.')
    activate_subscribers.short_description = "Activate selected subscribers"
    
    def deactivate_subscribers(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(is_active=False, unsubscribed_at=timezone.now())
        self.message_user(request, f'{updated} subscribers deactivated.')
    deactivate_subscribers.short_description = "Deactivate selected subscribers"

@admin.register(PopupDismissal)
class PopupDismissalAdmin(admin.ModelAdmin):
    list_display = ('session_key', 'user', 'dismissed_at', 'is_valid')
    list_filter = ('dismissed_at',)
    search_fields = ('session_key', 'user__username', 'user__email')
    readonly_fields = ('dismissed_at',)
    
    fieldsets = (
        ('Dismissal Information', {
            'fields': ('session_key', 'user')
        }),
        ('Timestamps', {
            'fields': ('dismissed_at',),
            'classes': ('collapse',)
        }),
    )
    
    def is_valid(self, obj):
        return obj.is_valid()
    is_valid.boolean = True
    is_valid.short_description = 'Valid (within 3 days)'

@admin.register(NewsletterCampaign)
class NewsletterCampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'sent_at', 'created_at')
    list_filter = ('sent_at', 'created_at')
    search_fields = ('title', 'subject', 'content')
    readonly_fields = ('created_at', 'sent_at')
    
    fieldsets = (
        ('Campaign Details', {
            'fields': ('title', 'subject', 'content')
        }),
        ('Delivery Information', {
            'fields': ('sent_at',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_sent']
    
    def mark_as_sent(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(sent_at=timezone.now())
        self.message_user(request, f'{updated} campaigns marked as sent.')
    mark_as_sent.short_description = "Mark selected campaigns as sent"

# Optional: Custom admin site header and title
admin.site.site_header = "PristinePrimier Real Estate Administration"
admin.site.site_title = "PristinePrimier Admin"
admin.site.index_title = "Welcome to PristinePrimier Admin Portal"