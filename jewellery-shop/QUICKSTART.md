# 🚀 Быстрый старт Jewellery Shop

Это краткая инструкция для максимально быстрого запуска проекта.

## Требования

- Docker Desktop установлен и запущен
- Порты 5173, 8000 и 5432 свободны

## Запуск за 4 шага

### 1. Перейдите в папку проекта
```bash
cd /Users/vladslav/PET_PROJECT/jewellery-shop
```

### 2. Запустите все сервисы
```bash
docker-compose up --build
```

Подождите, пока все контейнеры запустятся (это может занять несколько минут при первом запуске).

### 3. В новом терминале примените миграции и создайте тестовые данные
```bash
# Перейдите в папку проекта
cd /Users/vladslav/PET_PROJECT/jewellery-shop

# Примените миграции БД
docker-compose exec backend python manage.py migrate

# Создайте тестовые данные
docker-compose exec backend python manage.py seed_data
```

### 4. Откройте приложение в браузере

- **Frontend**: http://localhost:5173
- **Backend Admin**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/api/docs

## Тестовые аккаунты

**Администратор:**
- Email: `admin@jewellery.com`
- Пароль: `admin123`

**Покупатель:**
- Email: `customer@test.com`
- Пароль: `customer123`

## Остановка проекта

```bash
# Остановить все сервисы
docker-compose down

# Остановить и удалить все данные (БД тоже будет удалена)
docker-compose down -v
```

## Что дальше?

Читайте полную документацию в [README.md](README.md)
