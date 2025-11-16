"""
Настройки для локального запуска без Docker
Использует SQLite вместо PostgreSQL
"""

from .settings import *

# Используем SQLite для локальной разработки
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Отключаем CORS для локального запуска
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
]

CORS_ALLOW_ALL_ORIGINS = True

# Разрешаем все хосты для локальной разработки
ALLOWED_HOSTS = ['*']

DEBUG = True

# Простая конфигурация для media файлов
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'
