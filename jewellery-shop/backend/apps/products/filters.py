import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    """Фильтр для товаров"""

    # Фильтр по категории
    category = django_filters.CharFilter(field_name='category__slug', lookup_expr='exact')

    # Фильтр по материалу (можно несколько через запятую)
    material = django_filters.MultipleChoiceFilter(
        choices=Product.MATERIAL_CHOICES
    )

    # Фильтр по камню
    gemstone = django_filters.MultipleChoiceFilter(
        choices=Product.GEMSTONE_CHOICES
    )

    # Фильтр по ценовому диапазону
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    # Фильтр по наличию на складе
    in_stock = django_filters.BooleanFilter(field_name='stock', lookup_expr='gt', method='filter_in_stock')

    # Фильтр новинок и рекомендуемых
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    is_new = django_filters.BooleanFilter(field_name='is_new')

    class Meta:
        model = Product
        fields = ['category', 'material', 'gemstone', 'is_featured', 'is_new']

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0)
        return queryset.filter(stock=0)
