from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор для позиции заказа"""
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_price', 'quantity', 'total_price')
        read_only_fields = ('product_name', 'product_price')


class OrderListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка заказов"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'status', 'status_display',
            'payment_method', 'payment_method_display', 'is_paid',
            'total_price', 'items_count', 'created_at'
        )

    def get_items_count(self, obj):
        return obj.items.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о заказе"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'first_name', 'last_name', 'email', 'phone',
            'address', 'city', 'postal_code', 'total_price', 'status', 'status_display',
            'payment_method', 'payment_method_display', 'is_paid', 'notes',
            'items', 'created_at', 'updated_at'
        )
        read_only_fields = ('order_number', 'total_price')


class OrderCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания заказа"""

    class Meta:
        model = Order
        fields = (
            'first_name', 'last_name', 'email', 'phone',
            'address', 'city', 'postal_code', 'payment_method', 'notes'
        )

    def create(self, validated_data):
        # Получаем пользователя из контекста
        user = self.context['request'].user

        # Получаем корзину пользователя
        try:
            cart = user.cart
        except:
            raise serializers.ValidationError("Корзина пуста")

        if not cart.items.exists():
            raise serializers.ValidationError("Корзина пуста")

        # Создаем заказ
        order = Order.objects.create(
            user=user,
            total_price=cart.total_price,
            **validated_data
        )

        # Создаем позиции заказа из корзины
        for cart_item in cart.items.all():
            # Проверяем наличие товара
            if cart_item.product.stock < cart_item.quantity:
                order.delete()
                raise serializers.ValidationError(
                    f"Недостаточно товара {cart_item.product.name} на складе"
                )

            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                product_price=cart_item.product.price,
                quantity=cart_item.quantity
            )

            # Уменьшаем количество товара на складе
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()

        # Очищаем корзину
        cart.items.all().delete()

        return order
