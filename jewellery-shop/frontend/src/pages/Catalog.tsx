import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { Product, Category } from '../types';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: '',
    material: '',
    gemstone: '',
    priceRange: [0, 500000] as [number, number],
    sortBy: '-created_at',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const materials = [
    { value: 'gold_585', label: 'Золото 585' },
    { value: 'gold_750', label: 'Золото 750' },
    { value: 'silver_925', label: 'Серебро 925' },
    { value: 'platinum', label: 'Платина' },
    { value: 'white_gold', label: 'Белое золото' },
    { value: 'rose_gold', label: 'Розовое золото' },
  ];

  const gemstones = [
    { value: 'diamond', label: 'Бриллиант' },
    { value: 'emerald', label: 'Изумруд' },
    { value: 'ruby', label: 'Рубин' },
    { value: 'sapphire', label: 'Сапфир' },
    { value: 'topaz', label: 'Топаз' },
    { value: 'amethyst', label: 'Аметист' },
    { value: 'cubic_zirconia', label: 'Фианит' },
    { value: 'none', label: 'Без камней' },
  ];

  const sortOptions = [
    { value: '-created_at', label: 'Сначала новые' },
    { value: 'created_at', label: 'Сначала старые' },
    { value: 'price', label: 'Цена: по возрастанию' },
    { value: '-price', label: 'Цена: по убыванию' },
    { value: 'name', label: 'По названию (А-Я)' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        ordering: filters.sortBy,
      };

      if (filters.category) params.category = filters.category;
      if (filters.material) params.material = filters.material;
      if (filters.gemstone) params.gemstone = filters.gemstone;
      if (filters.priceRange[0] > 0) params.min_price = filters.priceRange[0];
      if (filters.priceRange[1] < 500000) params.max_price = filters.priceRange[1];

      const response = await api.get('/products/', { params });
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      material: '',
      gemstone: '',
      priceRange: [0, 500000],
      sortBy: '-created_at',
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.material,
    filters.gemstone,
  ].filter(Boolean).length + (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000 ? 1 : 0);

  const FilterContent = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Фильтры
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setFilterOpen(false)}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Category */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Категория</InputLabel>
        <Select
          value={filters.category}
          label="Категория"
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <MenuItem value="">Все</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Material */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Материал</InputLabel>
        <Select
          value={filters.material}
          label="Материал"
          onChange={(e) => handleFilterChange('material', e.target.value)}
        >
          <MenuItem value="">Все</MenuItem>
          {materials.map((mat) => (
            <MenuItem key={mat.value} value={mat.value}>
              {mat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Gemstone */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Камень</InputLabel>
        <Select
          value={filters.gemstone}
          label="Камень"
          onChange={(e) => handleFilterChange('gemstone', e.target.value)}
        >
          <MenuItem value="">Все</MenuItem>
          {gemstones.map((gem) => (
            <MenuItem key={gem.value} value={gem.value}>
              {gem.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Цена (₽)
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={(_, value) => handleFilterChange('priceRange', value)}
          valueLabelDisplay="auto"
          min={0}
          max={500000}
          step={5000}
          valueLabelFormat={(value) => `${value.toLocaleString('ru-RU')} ₽`}
          sx={{
            color: 'secondary.main',
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {filters.priceRange[0].toLocaleString('ru-RU')} ₽
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.priceRange[1].toLocaleString('ru-RU')} ₽
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="outlined"
        onClick={resetFilters}
        disabled={activeFiltersCount === 0}
      >
        Сбросить фильтры
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            mb: 1,
          }}
        >
          Каталог
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {products.length} {products.length === 1 ? 'товар' : 'товаров'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Desktop Filters */}
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={0} sx={{ position: 'sticky', top: 80 }}>
              <FilterContent />
            </Paper>
          </Grid>
        )}

        {/* Products */}
        <Grid item xs={12} md={9}>
          {/* Mobile Filter Button & Sort */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {isMobile && (
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterOpen(true)}
              >
                Фильтры
                {activeFiltersCount > 0 && (
                  <Chip
                    label={activeFiltersCount}
                    size="small"
                    sx={{ ml: 1, height: 20 }}
                  />
                )}
              </Button>
            )}

            <FormControl sx={{ minWidth: 200, flex: isMobile ? 1 : 0 }}>
              <InputLabel>Сортировка</InputLabel>
              <Select
                value={filters.sortBy}
                label="Сортировка"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Products Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: 'secondary.main' }} />
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Товары не найдены
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Попробуйте изменить фильтры
              </Typography>
              <Button
                variant="outlined"
                onClick={resetFilters}
                sx={{ mt: 3 }}
              >
                Сбросить фильтры
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} lg={4} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        <Box sx={{ width: 300 }}>
          <FilterContent />
        </Box>
      </Drawer>
    </Container>
  );
}
