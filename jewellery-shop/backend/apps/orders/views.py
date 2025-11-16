from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import (
    OrderListSerializer,
    OrderDetailSerializer,
    OrderCreateSerializer
)
from apps.products.permissions import IsAdminOrReadOnly


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с заказами"""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Админы видят все заказы, пользователи - только свои
        if user.is_admin:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'list':
            return OrderListSerializer
        return OrderDetailSerializer

    def create(self, request, *args, **kwargs):
        """Создание нового заказа"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # Возвращаем детальную информацию о созданном заказе
        detail_serializer = OrderDetailSerializer(order)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Обновление статуса заказа (только для админов)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Доступ запрещен'},
                status=status.HTTP_403_FORBIDDEN
            )

        order = self.get_object()
        new_status = request.data.get('status')

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Некорректный статус'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Отмена заказа"""
        order = self.get_object()

        # Проверка прав: пользователь может отменить только свой заказ,
        # если он еще не отправлен
        if not request.user.is_admin and order.user != request.user:
            return Response(
                {'error': 'Доступ запрещен'},
                status=status.HTTP_403_FORBIDDEN
            )

        if order.status in ['shipped', 'delivered']:
            return Response(
                {'error': 'Невозможно отменить отправленный или доставленный заказ'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = 'cancelled'
        order.save()

        # Возвращаем товары на склад
        for item in order.items.all():
            item.product.stock += item.quantity
            item.product.save()

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)
