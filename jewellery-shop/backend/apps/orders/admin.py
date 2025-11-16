from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """Инлайн для позиций заказа"""
    model = OrderItem
    extra = 0
    fields = ('product', 'product_name', 'product_price', 'quantity', 'total_price')
    readonly_fields = ('total_price',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Админ панель для заказов"""
    list_display = (
        'order_number', 'user', 'full_name', 'total_price',
        'status', 'payment_method', 'is_paid', 'created_at'
    )
    list_filter = ('status', 'payment_method', 'is_paid', 'created_at')
    search_fields = ('order_number', 'user__email', 'first_name', 'last_name', 'phone')
    inlines = [OrderItemInline]
    ordering = ('-created_at',)

    fieldsets = (
        ('Информация о заказе', {
            'fields': ('order_number', 'user', 'status', 'total_price')
        }),
        ('Контактные данные', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Адрес доставки', {
            'fields': ('address', 'city', 'postal_code')
        }),
        ('Оплата', {
            'fields': ('payment_method', 'is_paid')
        }),
        ('Дополнительно', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ('order_number', 'created_at', 'updated_at')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Админ панель для позиций заказа"""
    list_display = ('order', 'product_name', 'product_price', 'quantity', 'total_price')
    search_fields = ('order__order_number', 'product_name')
    readonly_fields = ('total_price',)
