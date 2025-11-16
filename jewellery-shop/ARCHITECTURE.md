# 🏗 Архитектура проекта Jewellery Shop

## Общая структура

Проект построен на микросервисной архитектуре с разделением на frontend и backend, связанных через REST API.

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                         │
│  React + TypeScript + Material-UI + Vite (Port 5173)   │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP REST API
                   │
┌──────────────────▼──────────────────────────────────────┐
│                        Backend                          │
│     Django + DRF + JWT Auth (Port 8000)                │
└──────────────────┬──────────────────────────────────────┘
                   │ ORM
                   │
┌──────────────────▼──────────────────────────────────────┐
│                       Database                          │
│               PostgreSQL 15 (Port 5432)                 │
└─────────────────────────────────────────────────────────┘
```

## Backend архитектура (Django)

### Слоистая архитектура:

```
┌──────────────────────────────────────────┐
│         Presentation Layer               │
│  (Views, Serializers, URLs)              │
├──────────────────────────────────────────┤
│         Business Logic Layer             │
│  (Models, Permissions, Filters)          │
├──────────────────────────────────────────┤
│         Data Access Layer                │
│  (Django ORM, Database)                  │
└──────────────────────────────────────────┘
```

### Приложения (Django Apps):

#### 1. `users` - Пользователи и аутентификация
- **Модели**: Custom User с ролями (customer, admin)
- **Функционал**: Регистрация, вход, JWT токены, профиль
- **Endpoints**: `/api/users/`

#### 2. `products` - Товары и категории
- **Модели**:
  - `Category` - Категории товаров
  - `Product` - Товары с характеристиками
  - `ProductImage` - Множественные изображения
- **Функционал**: CRUD, фильтрация, поиск, загрузка изображений
- **Endpoints**: `/api/products/`

#### 3. `cart` - Корзина
- **Модели**:
  - `Cart` - Корзина пользователя (1 к 1)
  - `CartItem` - Позиции в корзине
- **Функционал**: Добавление, удаление, изменение количества
- **Endpoints**: `/api/cart/`

#### 4. `orders` - Заказы
- **Модели**:
  - `Order` - Заказ с доставкой и оплатой
  - `OrderItem` - Позиции заказа (snapshot товара)
- **Функционал**: Создание из корзины, история, статусы, отмена
- **Endpoints**: `/api/orders/`

### Паттерны проектирования:

1. **Repository Pattern** - через Django ORM
2. **Serializer Pattern** - для преобразования данных
3. **ViewSet Pattern** - для REST API endpoints
4. **Permission Classes** - для авторизации
5. **Filter Backend** - для фильтрации и поиска

### Безопасность:

- JWT аутентификация
- CORS защита
- Permission based access control
- Password hashing (Django по умолчанию)
- Input validation через serializers

## Frontend архитектура (React)

### Компонентная архитектура:

```
src/
├── components/      # Переиспользуемые компоненты
│   ├── Layout/      # Header, Footer, Navigation
│   ├── Product/     # ProductCard, ProductGrid
│   └── Common/      # Button, Input, Modal
│
├── pages/           # Страницы (роуты)
│   ├── Home/
│   ├── Catalog/
│   ├── Product/
│   ├── Cart/
│   ├── Checkout/
│   ├── Profile/
│   └── Admin/
│
├── services/        # API клиенты
│   └── api.ts       # Axios instance + endpoints
│
├── store/           # State Management (Zustand)
│   ├── authStore    # Аутентификация
│   ├── cartStore    # Корзина
│   └── productStore # Товары
│
├── types/           # TypeScript типы
│   └── index.ts     # Все типы данных
│
└── theme/           # MUI тема
    └── index.ts     # Кастомная тема
```

### State Management:

Используется **Zustand** для простого и производительного управления состоянием:

- `authStore` - Пользователь, токены, статус авторизации
- `cartStore` - Корзина, количество товаров
- `productStore` - Кэш товаров, фильтры

### Роутинг:

React Router v6 с защищенными роутами:
- Публичные: `/`, `/catalog`, `/product/:slug`
- Приватные: `/cart`, `/checkout`, `/profile`
- Админ: `/admin/*`

## База данных

### ER диаграмма:

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│    User     │      │   Category   │      │   Product    │
├─────────────┤      ├──────────────┤      ├──────────────┤
│ id          │      │ id           │      │ id           │
│ email       │      │ name         │   ┌──│ category_id  │
│ role        │      │ slug         │   │  │ name         │
│ first_name  │      │ description  │   │  │ price        │
│ ...         │      └──────────────┘   │  │ stock        │
└─────────────┘              │          │  │ ...          │
      │                      └──────────┘  └──────────────┘
      │                                            │
      │                                            │
      ▼                                            ▼
┌─────────────┐      ┌──────────────┐    ┌──────────────┐
│    Cart     │      │   CartItem   │    │ProductImage  │
├─────────────┤      ├──────────────┤    ├──────────────┤
│ id          │◄─────│ cart_id      │    │ product_id   │
│ user_id     │      │ product_id   │───►│ image        │
└─────────────┘      │ quantity     │    │ is_main      │
      │              └──────────────┘    └──────────────┘
      │
      ▼
┌─────────────┐      ┌──────────────┐
│    Order    │      │  OrderItem   │
├─────────────┤      ├──────────────┤
│ id          │◄─────│ order_id     │
│ user_id     │      │ product_id   │
│ order_number│      │ quantity     │
│ status      │      │ price_snapshot│
│ total_price │      └──────────────┘
│ ...         │
└─────────────┘
```

### Индексы для производительности:

- `Product.slug` - быстрый поиск по URL
- `Product.category + is_active` - фильтрация в каталоге
- `Order.user_id + created_at` - история заказов
- `Order.status` - фильтрация по статусу

## Docker архитектура

### Контейнеры:

1. **db** (postgres:15-alpine)
   - База данных PostgreSQL
   - Volume для персистентности данных
   - Healthcheck для надежности

2. **backend** (Django)
   - Python 3.11
   - Django + DRF
   - Миграции при старте
   - Volume для media файлов

3. **frontend** (React)
   - Node 18
   - Vite dev server
   - Hot reload для разработки

### Сеть:

Все контейнеры в одной Docker сети `jewellery_network` для взаимодействия.

### Volumes:

- `postgres_data` - данные PostgreSQL
- `media_volume` - загруженные изображения
- `static_volume` - статические файлы Django

## API Design

### REST принципы:

- Использование HTTP методов по назначению (GET, POST, PATCH, DELETE)
- Статус коды (200, 201, 400, 401, 403, 404, 500)
- JSON формат данных
- Пагинация для списков
- Фильтрация через query параметры

### Примеры endpoints:

```
GET    /api/products/                    # Список товаров
GET    /api/products/?category=rings     # Фильтр по категории
GET    /api/products/diamond-ring/       # Конкретный товар
POST   /api/cart/add_item/               # Добавить в корзину
POST   /api/orders/                      # Создать заказ
PATCH  /api/orders/123/update_status/    # Изменить статус (admin)
```

## Расширяемость

Архитектура позволяет легко добавлять:

1. **Новые модели** - просто создать новое Django приложение
2. **Новые API** - добавить ViewSet и сериализаторы
3. **Новые страницы** - добавить компонент в `pages/`
4. **Интеграции** - payment gateways, email, etc.
5. **Микросервисы** - вынести функционал в отдельные сервисы

## Production готовность

Для production необходимо:

- [ ] Настроить Gunicorn/uWSGI вместо runserver
- [ ] Добавить Nginx для статики и reverse proxy
- [ ] Использовать Redis для кэширования и Celery
- [ ] Настроить HTTPS (Let's Encrypt)
- [ ] Использовать production БД (managed PostgreSQL)
- [ ] Настроить CI/CD (GitHub Actions, GitLab CI)
- [ ] Мониторинг (Sentry, New Relic)
- [ ] Логирование (ELK stack)
- [ ] Backups автоматические
- [ ] CDN для статики и изображений
