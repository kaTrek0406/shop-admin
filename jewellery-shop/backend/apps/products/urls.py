from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, ProductImageViewSet

app_name = 'products'

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('', ProductViewSet, basename='product')
router.register('images', ProductImageViewSet, basename='product-image')

urlpatterns = [
    path('', include(router.urls)),
]
