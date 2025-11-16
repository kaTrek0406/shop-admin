from django.contrib import admin
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    """Инлайн для изображений товара"""
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'is_main', 'order')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Админ панель для категорий"""
    list_display = ('name', 'slug', 'is_active', 'order', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order', 'name')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Админ панель для товаров"""
    list_display = (
        'name', 'category', 'material', 'gemstone', 'price',
        'stock', 'is_active', 'is_featured', 'is_new', 'created_at'
    )
    list_filter = (
        'category', 'material', 'gemstone', 'is_active',
        'is_featured', 'is_new', 'created_at'
    )
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]
    ordering = ('-created_at',)

    fieldsets = (
        ('Основная информация', {
            'fields': ('category', 'name', 'slug', 'description')
        }),
        ('Характеристики', {
            'fields': ('material', 'gemstone', 'weight', 'size')
        }),
        ('Цена и наличие', {
            'fields': ('price', 'stock')
        }),
        ('Статусы', {
            'fields': ('is_active', 'is_featured', 'is_new')
        }),
        ('Статистика', {
            'fields': ('views_count',),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ('views_count',)


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Админ панель для изображений товаров"""
    list_display = ('product', 'is_main', 'order', 'created_at')
    list_filter = ('is_main', 'created_at')
    search_fields = ('product__name', 'alt_text')
    ordering = ('product', 'order')
