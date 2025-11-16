from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Product, ProductImage
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ProductImageSerializer
)
from .permissions import IsAdminOrReadOnly
from .filters import ProductFilter


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с категориями"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()
        # Админы видят все категории, пользователи - только активные
        if not (self.request.user and self.request.user.is_admin):
            queryset = queryset.filter(is_active=True)
        return queryset


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с товарами"""
    queryset = Product.objects.prefetch_related('images', 'category').all()
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'views_count']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Админы видят все товары, пользователи - только активные
        if not (self.request.user and self.request.user.is_admin):
            queryset = queryset.filter(is_active=True)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        """Увеличиваем счетчик просмотров при просмотре товара"""
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Получить рекомендуемые товары"""
        featured_products = self.get_queryset().filter(is_featured=True)[:8]
        serializer = ProductListSerializer(
            featured_products,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def new(self, request):
        """Получить новинки"""
        new_products = self.get_queryset().filter(is_new=True)[:8]
        serializer = ProductListSerializer(
            new_products,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrReadOnly])
    def upload_image(self, request, slug=None):
        """Загрузка изображения для товара"""
        product = self.get_object()
        image_file = request.FILES.get('image')

        if not image_file:
            return Response(
                {'error': 'Изображение не предоставлено'},
                status=status.HTTP_400_BAD_REQUEST
            )

        is_main = request.data.get('is_main', False)
        alt_text = request.data.get('alt_text', '')

        product_image = ProductImage.objects.create(
            product=product,
            image=image_file,
            alt_text=alt_text,
            is_main=is_main
        )

        serializer = ProductImageSerializer(product_image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProductImageViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с изображениями товаров"""
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminOrReadOnly]
