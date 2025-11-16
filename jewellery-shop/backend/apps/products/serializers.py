from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор для категорий"""
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            'id', 'name', 'slug', 'description', 'image',
            'is_active', 'products_count', 'created_at'
        )

    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Сериализатор для изображений товара"""

    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'alt_text', 'is_main', 'order')


class ProductListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка товаров (краткая информация)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    main_image = serializers.SerializerMethodField()
    material_display = serializers.CharField(source='get_material_display', read_only=True)
    gemstone_display = serializers.CharField(source='get_gemstone_display', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'category', 'category_name',
            'material', 'material_display', 'gemstone', 'gemstone_display',
            'price', 'weight', 'size', 'stock', 'is_active', 'is_new', 'is_featured', 'in_stock', 'main_image'
        )

    def get_main_image(self, obj):
        main_img = obj.images.filter(is_main=True).first()
        if main_img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(main_img.image.url)
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о товаре"""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    material_display = serializers.CharField(source='get_material_display', read_only=True)
    gemstone_display = serializers.CharField(source='get_gemstone_display', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'category',
            'material', 'material_display', 'gemstone', 'gemstone_display',
            'price', 'weight', 'size', 'stock', 'in_stock',
            'is_active', 'is_featured', 'is_new', 'views_count',
            'images', 'created_at', 'updated_at'
        )


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания/обновления товара (для админов)"""

    class Meta:
        model = Product
        fields = (
            'id', 'category', 'name', 'description',
            'material', 'gemstone', 'price', 'weight', 'size',
            'stock', 'is_active', 'is_featured', 'is_new'
        )
        read_only_fields = ('id',)

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Цена не может быть отрицательной")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Количество не может быть отрицательным")
        return value
