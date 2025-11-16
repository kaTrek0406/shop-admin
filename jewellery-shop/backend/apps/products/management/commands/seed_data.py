from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.products.models import Category, Product
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Заполнение базы данных тестовыми данными'

    def handle(self, *args, **options):
        self.stdout.write('Создание тестовых данных...')

        # Создаем суперпользователя (админа)
        if not User.objects.filter(email='admin@jewellery.com').exists():
            User.objects.create_superuser(
                email='admin@jewellery.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write(self.style.SUCCESS('✓ Создан администратор: admin@jewellery.com / admin123'))

        # Создаем тестового покупателя
        if not User.objects.filter(email='customer@test.com').exists():
            User.objects.create_user(
                email='customer@test.com',
                password='customer123',
                first_name='Иван',
                last_name='Петров',
                phone='+7 (999) 123-45-67'
            )
            self.stdout.write(self.style.SUCCESS('✓ Создан покупатель: customer@test.com / customer123'))

        # Создаем категории
        categories_data = [
            {'name': 'Кольца', 'description': 'Изысканные кольца из драгоценных металлов'},
            {'name': 'Серьги', 'description': 'Элегантные серьги с камнями и без'},
            {'name': 'Браслеты', 'description': 'Роскошные браслеты для особых случаев'},
            {'name': 'Цепочки', 'description': 'Классические и современные цепочки'},
            {'name': 'Подвески', 'description': 'Изящные подвески и кулоны'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            categories[cat_data['name']] = category
            if created:
                self.stdout.write(f'  ✓ Создана категория: {cat_data["name"]}')

        # Создаем товары
        products_data = [
            {
                'name': 'Кольцо с бриллиантом "Сияние"',
                'category': 'Кольца',
                'description': 'Роскошное золотое кольцо 585 пробы с бриллиантом 0.5 карат. Изысканная огранка и безупречная чистота камня создают неповторимое сияние.',
                'material': 'gold_585',
                'gemstone': 'diamond',
                'price': Decimal('189000.00'),
                'weight': Decimal('3.5'),
                'size': '17',
                'stock': 5,
                'is_featured': True,
                'is_new': True,
            },
            {
                'name': 'Серьги с изумрудами "Императрица"',
                'category': 'Серьги',
                'description': 'Элегантные серьги из белого золота 750 пробы с натуральными изумрудами и бриллиантовой россыпью.',
                'material': 'white_gold',
                'gemstone': 'emerald',
                'price': Decimal('245000.00'),
                'weight': Decimal('6.2'),
                'stock': 3,
                'is_featured': True,
            },
            {
                'name': 'Браслет из розового золота "Нежность"',
                'category': 'Браслеты',
                'description': 'Утонченный браслет из розового золота 585 пробы. Идеальное дополнение к вечернему образу.',
                'material': 'rose_gold',
                'gemstone': 'none',
                'price': Decimal('95000.00'),
                'weight': Decimal('8.5'),
                'stock': 7,
                'is_new': True,
            },
            {
                'name': 'Цепочка из серебра "Классика"',
                'category': 'Цепочки',
                'description': 'Классическая серебряная цепочка 925 пробы плетения "Панцирь". Универсальное украшение на каждый день.',
                'material': 'silver_925',
                'gemstone': 'none',
                'price': Decimal('12500.00'),
                'weight': Decimal('15.0'),
                'stock': 15,
            },
            {
                'name': 'Подвеска с рубином "Страсть"',
                'category': 'Подвески',
                'description': 'Изящная подвеска из золота 585 пробы с натуральным рубином огранки "Сердце".',
                'material': 'gold_585',
                'gemstone': 'ruby',
                'price': Decimal('78000.00'),
                'weight': Decimal('2.8'),
                'stock': 4,
                'is_featured': True,
            },
            {
                'name': 'Кольцо с фианитами "Звёздная ночь"',
                'category': 'Кольца',
                'description': 'Серебряное кольцо 925 пробы с россыпью фианитов. Доступная роскошь для повседневной носки.',
                'material': 'silver_925',
                'gemstone': 'cubic_zirconia',
                'price': Decimal('8900.00'),
                'weight': Decimal('4.2'),
                'size': '16',
                'stock': 12,
            },
            {
                'name': 'Серьги-гвоздики с сапфирами',
                'category': 'Серьги',
                'description': 'Компактные серьги из платины с натуральными синими сапфирами. Элегантность в каждой детали.',
                'material': 'platinum',
                'gemstone': 'sapphire',
                'price': Decimal('165000.00'),
                'weight': Decimal('3.1'),
                'stock': 6,
            },
            {
                'name': 'Браслет с аметистами "Фиолетовый закат"',
                'category': 'Браслеты',
                'description': 'Изысканный браслет из белого золота с крупными аметистами огранки "Овал".',
                'material': 'white_gold',
                'gemstone': 'amethyst',
                'price': Decimal('135000.00'),
                'weight': Decimal('12.5'),
                'stock': 4,
                'is_new': True,
            },
        ]

        for product_data in products_data:
            category_name = product_data.pop('category')
            Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    'category': categories[category_name],
                    **product_data
                }
            )
            self.stdout.write(f'  ✓ Создан товар: {product_data["name"]}')

        self.stdout.write(self.style.SUCCESS('\n✅ Заполнение базы данных завершено!'))
        self.stdout.write(self.style.WARNING('\nДанные для входа:'))
        self.stdout.write('  Администратор: admin@jewellery.com / admin123')
        self.stdout.write('  Покупатель: customer@test.com / customer123')
