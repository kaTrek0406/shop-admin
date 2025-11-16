from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from apps.products.models import Product
import uuid


class Order(models.Model):
    """Модель заказа"""

    STATUS_CHOICES = (
        ('pending', 'Ожидает обработки'),
        ('processing', 'В обработке'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменен'),
    )

    PAYMENT_CHOICES = (
        ('cash', 'Наличные при получении'),
        ('card', 'Банковская карта'),
        ('online', 'Онлайн оплата'),
    )

    # Уникальный номер заказа
    order_number = models.UUIDField('Номер заказа', default=uuid.uuid4, editable=False, unique=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='Пользователь'
    )

    # Контактная информация
    first_name = models.CharField('Имя', max_length=100)
    last_name = models.CharField('Фамилия', max_length=100)
    email = models.EmailField('Email')
    phone = models.CharField('Телефон', max_length=20)

    # Адрес доставки
    address = models.TextField('Адрес доставки')
    city = models.CharField('Город', max_length=100)
    postal_code = models.CharField('Почтовый индекс', max_length=10)

    # Сумма и статус
    total_price = models.DecimalField(
        'Общая стоимость',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField('Способ оплаты', max_length=20, choices=PAYMENT_CHOICES)
    is_paid = models.BooleanField('Оплачен', default=False)

    # Заметки
    notes = models.TextField('Заметки к заказу', blank=True)

    # Даты
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Заказ #{self.order_number} - {self.user.email}"

    @property
    def full_name(self):
        """Полное имя заказчика"""
        return f"{self.first_name} {self.last_name}".strip()


class OrderItem(models.Model):
    """Модель позиции заказа"""
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Заказ'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        verbose_name='Товар'
    )

    # Сохраняем данные товара на момент заказа
    product_name = models.CharField('Название товара', max_length=200)
    product_price = models.DecimalField('Цена за единицу', max_digits=10, decimal_places=2)

    quantity = models.PositiveIntegerField(
        'Количество',
        default=1,
        validators=[MinValueValidator(1)]
    )

    class Meta:
        verbose_name = 'Позиция заказа'
        verbose_name_plural = 'Позиции заказа'

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    @property
    def total_price(self):
        """Стоимость позиции"""
        return self.product_price * self.quantity
