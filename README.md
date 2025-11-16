# 💎 Jewellery Shop - Премиальный интернет-магазин ювелирных изделий

Современный полнофункциональный интернет-магазин ювелирных изделий с элегантным дизайном, корзиной, оформлением заказов и админ-панелью.

## 📋 Описание проекта

Jewellery Shop - это полноценное веб-приложение для продажи ювелирных изделий премиум-класса. Проект включает в себя:

- ✨ **Витрину товаров** с премиальным дизайном
- 🛒 **Корзину** с управлением количеством товаров
- 📦 **Систему заказов** с историей и статусами
- 👤 **Личный кабинет** пользователя
- 🔐 **Аутентификацию** с JWT токенами
- 🎨 **Админ-панель** для управления товарами, категориями и заказами
- 📱 **Адаптивный дизайн** для всех устройств
- 🚀 **REST API** для взаимодействия frontend и backend

## 🎯 Возможности

### Для покупателей:
- Просмотр каталога ювелирных изделий с фильтрацией
- Детальная карточка товара с фотографиями
- Добавление товаров в корзину
- Оформление заказа с указанием данных доставки
- Просмотр истории своих заказов
- Управление профилем

### Для администраторов:
- Управление товарами (создание, редактирование, удаление)
- Управление категориями
- Загрузка изображений товаров
- Просмотр всех заказов
- Изменение статусов заказов
- Управление пользователями через Django Admin

## 🛠 Технологический стек

### Backend:
- **Python 3.11** - Современная версия Python
- **Django 5.0** - Мощный веб-фреймворк
- **Django REST Framework 3.14** - Создание REST API
- **PostgreSQL 15** - Надежная реляционная БД
- **JWT Authentication** - Безопасная аутентификация
- **Docker & Docker Compose** - Контейнеризация

**Почему Django?**
- Кроссплатформенность (работает одинаково на Windows, macOS, Linux)
- Встроенная ORM для работы с БД
- Мощная админ-панель из коробки
- Отличная документация и большое сообщество
- Готовые решения для аутентификации и безопасности

### Frontend:
- **React 18** - Современная UI библиотека
- **TypeScript** - Типизированный JavaScript
- **Vite** - Быстрый сборщик
- **Material-UI (MUI)** - Премиальные UI компоненты
- **React Router** - Роутинг в приложении
- **Axios** - HTTP клиент
- **Zustand** - Управление состоянием
- **Framer Motion** - Анимации

**Почему React + TypeScript?**
- Переиспользуемые компоненты
- Типизация для предотвращения ошибок
- Огромная экосистема библиотек
- Отличная производительность
- Лучшие практики разработки

### База данных:
- **PostgreSQL 15** - Production-ready СУБД

**Почему PostgreSQL?**
- Надежность и производительность
- Поддержка сложных запросов
- ACID транзакции
- Расширяемость
- Отлично работает с Django ORM

### DevOps:
- **Docker** - Контейнеризация приложений
- **Docker Compose** - Оркестрация контейнеров

**Почему Docker?**
- Одинаковая работа на любой ОС (Windows, macOS, Linux)
- Изолированная среда
- Простое развертывание
- Воспроизводимость окружения

## 📁 Архитектура проекта

```
jewellery-shop/
├── backend/                      # Django Backend
│   ├── apps/
│   │   ├── users/               # Пользователи и аутентификация
│   │   │   ├── models.py        # Модель User с ролями
│   │   │   ├── serializers.py   # Сериализаторы для API
│   │   │   ├── views.py         # API endpoints
│   │   │   └── urls.py          # URL маршруты
│   │   │
│   │   ├── products/            # Товары и категории
│   │   │   ├── models.py        # Category, Product, ProductImage
│   │   │   ├── serializers.py   # Сериализаторы товаров
│   │   │   ├── views.py         # CRUD операции
│   │   │   ├── filters.py       # Фильтры по материалу, камню, цене
│   │   │   ├── permissions.py   # Разрешения для админов
│   │   │   └── admin.py         # Django Admin настройки
│   │   │
│   │   ├── cart/                # Корзина
│   │   │   ├── models.py        # Cart, CartItem
│   │   │   ├── serializers.py   # Сериализаторы корзины
│   │   │   └── views.py         # Управление корзиной
│   │   │
│   │   └── orders/              # Заказы
│   │       ├── models.py        # Order, OrderItem
│   │       ├── serializers.py   # Сериализаторы заказов
│   │       └── views.py         # Создание и управление заказами
│   │
│   ├── config/                  # Настройки Django
│   │   ├── settings.py          # Основные настройки
│   │   ├── urls.py              # Главный роутинг
│   │   └── wsgi.py              # WSGI конфигурация
│   │
│   ├── media/                   # Загруженные изображения
│   ├── requirements.txt         # Python зависимости
│   ├── manage.py                # Django CLI
│   └── Dockerfile               # Docker образ для backend
│
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/          # React компоненты
│   │   ├── pages/               # Страницы приложения
│   │   ├── services/            # API клиенты (axios)
│   │   ├── store/               # State management (zustand)
│   │   ├── theme/               # MUI тема и стили
│   │   ├── types/               # TypeScript типы
│   │   ├── App.tsx              # Главный компонент
│   │   └── main.tsx             # Точка входа
│   │
│   ├── package.json             # npm зависимости
│   ├── vite.config.ts           # Vite конфигурация
│   ├── tsconfig.json            # TypeScript конфигурация
│   └── Dockerfile               # Docker образ для frontend
│
├── docker-compose.yml           # Оркестрация всех сервисов
├── .env.example                 # Пример переменных окружения
├── .gitignore                   # Игнорируемые файлы
└── README.md                    # Эта документация
```

## 🚀 Быстрый старт

### Требования:
- **Docker** и **Docker Compose** установлены на вашем компьютере
- **Git** для клонирования репозитория

### Установка и запуск:

#### Шаг 1: Клонирование репозитория
```bash
cd /Users/vladslav/PET_PROJECT
# Проект уже находится в jewellery-shop/
```

#### Шаг 2: Настройка переменных окружения
```bash
cd jewellery-shop
cp .env.example .env
```

Отредактируйте `.env` файл при необходимости (для разработки можно оставить значения по умолчанию).

#### Шаг 3: Запуск проекта через Docker Compose

**На macOS/Linux:**
```bash
docker-compose up --build
```

**На Windows (PowerShell):**
```powershell
docker-compose up --build
```

Эта команда:
1. Поднимет PostgreSQL базу данных
2. Запустит Django backend на порту 8000
3. Запустит React frontend на порту 5173

#### Шаг 4: Применение миграций и создание тестовых данных

Откройте новый терминал и выполните:

```bash
# Применить миграции базы данных
docker-compose exec backend python manage.py migrate

# Создать тестовые данные (категории, товары, пользователей)
docker-compose exec backend python manage.py seed_data
```

#### Шаг 5: Готово! Открывайте приложение

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin
- **API Документация (Swagger)**: http://localhost:8000/api/docs

### Тестовые аккаунты:

После выполнения команды `seed_data` будут созданы:

**Администратор:**
- Email: `admin@jewellery.com`
- Пароль: `admin123`

**Покупатель:**
- Email: `customer@test.com`
- Пароль: `customer123`

## 📚 API Endpoints

### Аутентификация (`/api/users/`)
- `POST /register/` - Регистрация нового пользователя
- `POST /login/` - Вход (получение JWT токенов)
- `POST /token/refresh/` - Обновление access токена
- `GET /profile/` - Получить профиль текущего пользователя
- `PATCH /profile/` - Обновить профиль
- `POST /change-password/` - Изменить пароль

### Товары (`/api/products/`)
- `GET /` - Список всех товаров (с пагинацией, фильтрацией, поиском)
- `GET /:slug/` - Детальная информация о товаре
- `GET /featured/` - Рекомендуемые товары
- `GET /new/` - Новинки
- `POST /` - Создать товар *(только админ)*
- `PATCH /:slug/` - Обновить товар *(только админ)*
- `DELETE /:slug/` - Удалить товар *(только админ)*
- `POST /:slug/upload_image/` - Загрузить изображение *(только админ)*

### Категории (`/api/products/categories/`)
- `GET /` - Список всех категорий
- `GET /:slug/` - Детальная информация о категории
- `POST /` - Создать категорию *(только админ)*
- `PATCH /:slug/` - Обновить категорию *(только админ)*
- `DELETE /:slug/` - Удалить категорию *(только админ)*

### Корзина (`/api/cart/`)
- `GET /` - Получить корзину текущего пользователя
- `POST /add_item/` - Добавить товар в корзину
- `PATCH /update_item/` - Обновить количество товара
- `DELETE /remove_item/` - Удалить товар из корзины
- `DELETE /clear/` - Очистить корзину

### Заказы (`/api/orders/`)
- `GET /` - Список заказов (пользователь видит только свои)
- `GET /:id/` - Детальная информация о заказе
- `POST /` - Создать заказ из корзины
- `POST /:id/cancel/` - Отменить заказ
- `PATCH /:id/update_status/` - Обновить статус *(только админ)*

## 🎨 Дизайн и UX

Проект использует премиальный дизайн с акцентом на роскошь и элегантность:

### Цветовая палитра:
- **Primary**: Глубокий темно-синий (#1a1a2e)
- **Secondary**: Золотой (#d4af37)
- **Background**: Светло-серый (#f5f5f7)

### Типографика:
- **Заголовки**: Playfair Display (serif) - элегантный шрифт
- **Основной текст**: Inter/Roboto - читаемый sans-serif

### UI/UX особенности:
- Плавные анимации и переходы
- Hover эффекты на карточках товаров
- Тени и градиенты для глубины
- Адаптивный дизайн (mobile-first)
- Skeleton loaders для лучшего UX
- Toast уведомления для feedback

## 🔧 Полезные команды

### Управление Docker:

```bash
# Запуск всех сервисов
docker-compose up

# Запуск в фоновом режиме
docker-compose up -d

# Остановка всех сервисов
docker-compose down

# Просмотр логов
docker-compose logs -f

# Перестроить образы
docker-compose up --build

# Остановить и удалить всё (включая volumes)
docker-compose down -v
```

### Django команды:

```bash
# Создать миграции
docker-compose exec backend python manage.py makemigrations

# Применить миграции
docker-compose exec backend python manage.py migrate

# Создать суперпользователя
docker-compose exec backend python manage.py createsuperuser

# Заполнить БД тестовыми данными
docker-compose exec backend python manage.py seed_data

# Запустить shell Django
docker-compose exec backend python manage.py shell

# Собрать статические файлы
docker-compose exec backend python manage.py collectstatic
```

### Frontend команды:

```bash
# Установить зависимости
cd frontend && npm install

# Запустить dev сервер (без Docker)
npm run dev

# Собрать production build
npm run build

# Линтинг
npm run lint
```

## 🌟 Расширение функционала

Проект можно легко расширить следующими фичами:

### 1. Платежные системы:
```python
# backend/apps/payments/
- Интеграция Stripe
- Интеграция PayPal
- Интеграция Yookassa (для России)
```

### 2. Email уведомления:
```python
# backend/apps/notifications/
- Подтверждение заказа
- Изменение статуса
- Восстановление пароля
- Рассылки
```

### 3. Мультиязычность:
```javascript
// frontend/src/i18n/
- react-i18next
- Переводы на английский, немецкий и др.
```

### 4. Отзывы и рейтинги:
```python
# backend/apps/reviews/
- Модель Review
- Рейтинг товаров
- Модерация отзывов
```

### 5. Wishlist (Избранное):
```python
# backend/apps/wishlist/
- Добавление в избранное
- Страница избранного
```

### 6. Сравнение товаров:
```javascript
// frontend/src/features/compare/
- Добавление в сравнение
- Таблица сравнения характеристик
```

### 7. Промокоды и скидки:
```python
# backend/apps/promotions/
- Модель Coupon
- Применение скидок
- Акции и спецпредложения
```

### 8. Расширенная аналитика:
```python
# backend/apps/analytics/
- Google Analytics
- Яндекс.Метрика
- Отслеживание конверсий
```

## 🐛 Troubleshooting (Решение проблем)

### Проблема: Порт уже занят

**Ошибка**: `Port 8000 is already allocated`

**Решение**:
```bash
# Найти процесс на порту
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Остановить процесс или изменить порт в docker-compose.yml
```

### Проблема: База данных не подключается

**Ошибка**: `could not connect to server`

**Решение**:
```bash
# Проверить статус контейнеров
docker-compose ps

# Перезапустить БД
docker-compose restart db

# Проверить логи
docker-compose logs db
```

### Проблема: Миграции не применяются

**Решение**:
```bash
# Сбросить БД и применить миграции заново
docker-compose down -v
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_data
```

### Проблема: Frontend не подключается к backend

**Проверьте**:
1. Backend запущен на порту 8000
2. В `.env` указан правильный `VITE_API_URL`
3. CORS настроен в Django settings

### Проблема: Docker занимает много места

**Решение**:
```bash
# Очистить неиспользуемые образы и контейнеры
docker system prune -a

# Очистить volumes
docker volume prune
```

## 📸 Скриншоты

> **Примечание**: Добавьте скриншоты интерфейса после запуска проекта:

- Главная страница с hero-секцией
- Каталог товаров с фильтрами
- Детальная карточка товара
- Корзина
- Оформление заказа
- Личный кабинет
- Админ-панель

## 📝 Лицензия

MIT License - свободное использование для коммерческих и некоммерческих целей.

## 👨‍💻 Автор

Разработано как PET-проект для демонстрации навыков full-stack разработки.

## 🤝 Контрибьюция

Проект открыт для улучшений! Если вы хотите добавить новую функцию:

1. Форкните репозиторий
2. Создайте ветку для новой фичи (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## ⭐ Поддержка

Если проект оказался полезным, поставьте звезду на GitHub!

---

**Создано с ❤️ используя Django, React и Docker**
