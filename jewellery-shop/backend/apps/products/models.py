from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify
from unidecode import unidecode


class Category(models.Model):
    """Модель категории товаров"""
    name = models.CharField('Название', max_length=100, unique=True)
    slug = models.SlugField('URL slug', unique=True, blank=True)
    description = models.TextField('Описание', blank=True)
    image = models.ImageField('Изображение', upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField('Активна', default=True)
    order = models.IntegerField('Порядок сортировки', default=0)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            # Транслитерация для кириллицы
            self.slug = slugify(unidecode(self.name))
        super().save(*args, **kwargs)


class Product(models.Model):
    """Модель товара (ювелирное изделие)"""

    MATERIAL_CHOICES = (
        ('gold_585', 'Золото 585'),
        ('gold_750', 'Золото 750'),
        ('silver_925', 'Серебро 925'),
        ('platinum', 'Платина'),
        ('white_gold', 'Белое золото'),
        ('rose_gold', 'Розовое золото'),
    )

    GEMSTONE_CHOICES = (
        ('diamond', 'Бриллиант'),
        ('emerald', 'Изумруд'),
        ('ruby', 'Рубин'),
        ('sapphire', 'Сапфир'),
        ('topaz', 'Топаз'),
        ('amethyst', 'Аметист'),
        ('cubic_zirconia', 'Фианит'),
        ('none', 'Без камней'),
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='Категория'
    )
    name = models.CharField('Название', max_length=200)
    slug = models.SlugField('URL slug', unique=True, blank=True)
    description = models.TextField('Описание')
    material = models.CharField('Материал', max_length=20, choices=MATERIAL_CHOICES)
    gemstone = models.CharField('Камень', max_length=20, choices=GEMSTONE_CHOICES, default='none')

    price = models.DecimalField(
        'Цена',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    weight = models.DecimalField(
        'Вес (г)',
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        blank=True,
        null=True
    )
    size = models.CharField('Размер', max_length=10, blank=True, null=True)

    stock = models.IntegerField(
        'Количество на складе',
        default=0,
        validators=[MinValueValidator(0)]
    )
    is_active = models.BooleanField('Активен', default=True)
    is_featured = models.BooleanField('Рекомендуемый', default=False)
    is_new = models.BooleanField('Новинка', default=False)

    views_count = models.IntegerField('Количество просмотров', default=0)
    created_at = models.DateTimeField('Дата добавления', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active', 'is_featured']),
            models.Index(fields=['category', 'is_active']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            # Транслитерация для кириллицы
            self.slug = slugify(unidecode(self.name))
        super().save(*args, **kwargs)

    @property
    def in_stock(self):
        """Проверка наличия на складе"""
        return self.stock > 0

    @property
    def main_image(self):
        """Получение главного изображения товара"""
        return self.images.filter(is_main=True).first()


class ProductImage(models.Model):
    """Модель изображений товара"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Товар'
    )
    image = models.ImageField('Изображение', upload_to='products/')
    alt_text = models.CharField('Альтернативный текст', max_length=200, blank=True)
    is_main = models.BooleanField('Главное изображение', default=False)
    order = models.IntegerField('Порядок', default=0)
    created_at = models.DateTimeField('Дата загрузки', auto_now_add=True)

    class Meta:
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товаров'
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"Изображение для {self.product.name}"

    def save(self, *args, **kwargs):
        # Если это главное изображение, убираем флаг у других
        if self.is_main:
            ProductImage.objects.filter(
                product=self.product,
                is_main=True
            ).exclude(pk=self.pk).update(is_main=False)
        super().save(*args, **kwargs)
