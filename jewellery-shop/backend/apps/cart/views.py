from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from apps.products.models import Product


class CartViewSet(viewsets.ViewSet):
    """ViewSet для работы с корзиной"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Получить корзину текущего пользователя"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Добавить товар в корзину"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Товар не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Проверка наличия на складе
        if product.stock < quantity:
            return Response(
                {'error': 'Недостаточно товара на складе'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Добавляем или обновляем позицию в корзине
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        """Обновить количество товара в корзине"""
        cart = get_object_or_404(Cart, user=request.user)
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')

        try:
            cart_item = cart.items.get(id=item_id)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Позиция не найдена в корзине'},
                status=status.HTTP_404_NOT_FOUND
            )

        if quantity < 1:
            return Response(
                {'error': 'Количество должно быть больше 0'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if cart_item.product.stock < quantity:
            return Response(
                {'error': 'Недостаточно товара на складе'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Удалить товар из корзины"""
        cart = get_object_or_404(Cart, user=request.user)
        item_id = request.data.get('item_id')

        try:
            cart_item = cart.items.get(id=item_id)
            cart_item.delete()
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Позиция не найдена в корзине'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Очистить корзину"""
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
