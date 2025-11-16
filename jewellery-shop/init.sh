#!/bin/bash

echo "🚀 Запуск инициализации Jewellery Shop..."

echo "📦 Применение миграций базы данных..."
docker-compose exec backend python manage.py migrate

echo "🌱 Создание тестовых данных..."
docker-compose exec backend python manage.py seed_data

echo "✅ Инициализация завершена!"
echo ""
echo "Откройте приложение:"
echo "  Frontend: http://localhost:5173"
echo "  Admin: http://localhost:8000/admin"
echo "  API Docs: http://localhost:8000/api/docs"
echo ""
echo "Тестовые аккаунты:"
echo "  Администратор: admin@jewellery.com / admin123"
echo "  Покупатель: customer@test.com / customer123"
