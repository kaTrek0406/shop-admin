# 🚀 Запуск Jewellery Shop

## Важно!

Для запуска проекта необходим **Docker Desktop**. Проект использует Docker для обеспечения кроссплатформенности и изоляции окружения.

## Установка Docker Desktop (если ещё не установлен)

### На macOS:
1. Скачайте Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Установите приложение
3. Запустите Docker Desktop
4. Дождитесь, пока Docker полностью запустится (значок в верхней панели)

### На Windows:
1. Скачайте Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Установите приложение
3. Перезагрузите компьютер (если требуется)
4. Запустите Docker Desktop

## Запуск проекта (после установки Docker)

### Шаг 1: Убедитесь, что Docker запущен
```bash
# Проверить, что Docker работает
docker --version
docker compose version
```

Вы должны увидеть версии Docker и Docker Compose.

### Шаг 2: Перейдите в папку проекта
```bash
cd /Users/vladslav/PET_PROJECT/jewellery-shop
```

### Шаг 3: Запустите все сервисы
```bash
# Запуск в фоновом режиме
docker compose up --build -d

# Или запуск с выводом логов (чтобы видеть что происходит)
docker compose up --build
```

При первом запуске Docker:
- Скачает образы (PostgreSQL, Python, Node.js)
- Соберёт контейнеры
- Запустит все сервисы

Это займёт 3-5 минут.

### Шаг 4: Примените миграции и создайте тестовые данные

Откройте **новый терминал** (не закрывая предыдущий) и выполните:

```bash
cd /Users/vladslav/PET_PROJECT/jewellery-shop

# Применить миграции базы данных
docker compose exec backend python manage.py migrate

# Создать тестовые данные
docker compose exec backend python manage.py seed_data
```

### Шаг 5: Откройте приложение в браузере

- **Frontend (React)**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin
- **API Документация**: http://localhost:8000/api/docs

## Тестовые аккаунты

После выполнения `seed_data`:

**Администратор:**
- Email: `admin@jewellery.com`
- Пароль: `admin123`

**Покупатель:**
- Email: `customer@test.com`
- Пароль: `customer123`

## Проверка статуса

```bash
# Посмотреть запущенные контейнеры
docker compose ps

# Посмотреть логи всех сервисов
docker compose logs

# Посмотреть логи конкретного сервиса
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

## Остановка проекта

```bash
# Остановить все сервисы (данные сохранятся)
docker compose down

# Остановить и удалить все данные (включая БД)
docker compose down -v
```

## Перезапуск после изменений

```bash
# Если изменили код backend
docker compose restart backend

# Если изменили код frontend
docker compose restart frontend

# Если изменили docker-compose.yml или Dockerfile
docker compose up --build -d
```

## Troubleshooting

### Порт уже занят
**Ошибка**: `Error starting userland proxy: listen tcp4 0.0.0.0:8000: bind: address already in use`

**Решение**:
```bash
# Найти процесс на порту 8000
lsof -i :8000

# Остановить процесс или изменить порт в docker-compose.yml
```

### Docker не запускается
1. Убедитесь, что Docker Desktop запущен
2. Перезапустите Docker Desktop
3. Перезагрузите компьютер

### База данных не подключается
```bash
# Проверить статус контейнера БД
docker compose ps db

# Посмотреть логи БД
docker compose logs db

# Перезапустить БД
docker compose restart db
```

### Frontend не собирается
```bash
# Удалить node_modules и пересобрать
docker compose down
docker compose up --build frontend
```

### Всё сломалось - полный сброс
```bash
# Удалить всё и начать заново
docker compose down -v
docker system prune -a
docker compose up --build
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_data
```

## Альтернативный запуск (без Docker - НЕ РЕКОМЕНДУЕТСЯ)

Если Docker не работает, можно запустить локально, но это сложнее:

### Требования:
- Python 3.11 (не 3.13!)
- Node.js 18+
- PostgreSQL 15

### Backend:
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
pip install -r requirements.txt

# Настроить PostgreSQL и изменить .env
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

Но **Docker намного проще!** 😊

## Что дальше?

После успешного запуска:
1. Откройте http://localhost:8000/admin и войдите как админ
2. Посмотрите созданные товары и категории
3. Откройте http://localhost:8000/api/docs для API документации
4. Frontend пока минимальный - основной функционал в Backend API

Читайте полную документацию в [README.md](README.md)
