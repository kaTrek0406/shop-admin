#!/bin/bash

echo "🔍 Проверка окружения для Jewellery Shop..."
echo ""

# Проверка Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker установлен"
    docker --version
else
    echo "❌ Docker НЕ установлен"
    echo ""
    echo "📥 Установите Docker Desktop:"
    echo "   macOS: https://www.docker.com/products/docker-desktop/"
    echo "   Windows: https://www.docker.com/products/docker-desktop/"
    echo ""
    exit 1
fi

echo ""

# Проверка Docker Compose
if command -v docker compose &> /dev/null || command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose установлен"
    docker compose version 2>/dev/null || docker-compose --version
else
    echo "❌ Docker Compose НЕ установлен"
    exit 1
fi

echo ""

# Проверка, что Docker запущен
if docker info &> /dev/null; then
    echo "✅ Docker запущен и работает"
else
    echo "❌ Docker установлен, но НЕ запущен"
    echo ""
    echo "🚀 Запустите Docker Desktop и попробуйте снова"
    exit 1
fi

echo ""
echo "✅ Всё готово для запуска проекта!"
echo ""
echo "Следующие шаги:"
echo "1. cd /Users/vladslav/PET_PROJECT/jewellery-shop"
echo "2. docker compose up --build -d"
echo "3. docker compose exec backend python manage.py migrate"
echo "4. docker compose exec backend python manage.py seed_data"
echo "5. Открыть http://localhost:5173"
