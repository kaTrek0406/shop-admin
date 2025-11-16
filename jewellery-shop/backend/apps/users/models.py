from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Менеджер для кастомной модели пользователя"""

    def create_user(self, email, password=None, **extra_fields):
        """Создание обычного пользователя"""
        if not email:
            raise ValueError('Email обязателен')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Создание суперпользователя (администратора)"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser должен иметь is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser должен иметь is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Модель пользователя с расширенными полями"""

    ROLE_CHOICES = (
        ('customer', 'Покупатель'),
        ('admin', 'Администратор'),
    )

    username = None  # Убираем username, используем email
    email = models.EmailField('Email', unique=True)
    role = models.CharField('Роль', max_length=10, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField('Телефон', max_length=20, blank=True, null=True)
    address = models.TextField('Адрес доставки', blank=True, null=True)
    city = models.CharField('Город', max_length=100, blank=True, null=True)
    postal_code = models.CharField('Почтовый индекс', max_length=10, blank=True, null=True)
    created_at = models.DateTimeField('Дата регистрации', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

    @property
    def is_admin(self):
        """Проверка, является ли пользователь администратором"""
        return self.role == 'admin' or self.is_superuser

    @property
    def full_name(self):
        """Полное имя пользователя"""
        return f"{self.first_name} {self.last_name}".strip()
