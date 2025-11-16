from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    """Инлайн для позиций корзины"""
    model = CartItem
    extra = 0
    fields = ('product', 'quantity', 'total_price')
    readonly_fields = ('total_price',)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Админ панель для корзин"""
    list_display = ('user', 'total_items', 'total_price', 'updated_at')
    search_fields = ('user__email',)
    inlines = [CartItemInline]
    readonly_fields = ('created_at', 'updated_at', 'total_price', 'total_items')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """Админ панель для позиций корзины"""
    list_display = ('cart', 'product', 'quantity', 'total_price', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('cart__user__email', 'product__name')
    readonly_fields = ('total_price', 'created_at', 'updated_at')
