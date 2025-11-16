import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Switch,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ViewList,
  ViewModule,
  Search,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Product, Category } from '../../types';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    material: 'gold_585',
    gemstone: 'none',
    price: '',
    weight: '',
    size: '',
    stock: '',
    is_active: true,
    is_featured: false,
    is_new: false,
  });

  const materials = [
    { value: 'gold_585', label: 'Золото 585' },
    { value: 'gold_750', label: 'Золото 750' },
    { value: 'silver_925', label: 'Серебро 925' },
    { value: 'platinum', label: 'Платина' },
    { value: 'white_gold', label: 'Белое золото' },
    { value: 'rose_gold', label: 'Розовое золото' },
  ];

  const gemstones = [
    { value: 'none', label: 'Без камней' },
    { value: 'diamond', label: 'Бриллиант' },
    { value: 'emerald', label: 'Изумруд' },
    { value: 'ruby', label: 'Рубин' },
    { value: 'sapphire', label: 'Сапфир' },
    { value: 'topaz', label: 'Топаз' },
    { value: 'amethyst', label: 'Аметист' },
    { value: 'cubic_zirconia', label: 'Фианит' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products/'),
        api.get('/products/categories/'),
      ]);
      setProducts(productsRes.data.results || productsRes.data);
      setCategories(categoriesRes.data.results || categoriesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category.toString(),
        material: product.material,
        gemstone: product.gemstone,
        price: product.price.toString(),
        weight: product.weight?.toString() || '',
        size: product.size || '',
        stock: product.stock.toString(),
        is_active: product.is_active,
        is_featured: product.is_featured,
        is_new: product.is_new,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: categories[0]?.id.toString() || '',
        material: 'gold_585',
        gemstone: 'none',
        price: '',
        weight: '',
        size: '',
        stock: '',
        is_active: true,
        is_featured: false,
        is_new: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setError('');
  };

  const handleChange = (e: any) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        category: parseInt(formData.category),
        price: parseFloat(formData.price),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        await api.patch(`/products/${editingProduct.slug}/`, data);
        setSuccess('Товар успешно обновлен');
      } else {
        await api.post('/products/', data);
        setSuccess('Товар успешно создан');
      }

      handleCloseDialog();
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка сохранения товара');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      await api.delete(`/products/${slug}/`);
      setSuccess('Товар успешно удален');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Ошибка удаления товара');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
          }}
        >
          Управление товарами
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: 'secondary.main',
            color: 'primary.main',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
        >
          Добавить товар
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Поиск товаров..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <ToggleButton value="grid">
            <ViewModule />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* Products Grid */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{
                    pt: '100%',
                    backgroundColor: 'grey.100',
                    backgroundImage: product.main_image
                      ? `url(${product.main_image})`
                      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                    {product.is_new && (
                      <Chip label="NEW" size="small" color="secondary" />
                    )}
                    {product.is_featured && (
                      <Chip label="ХИТ" size="small" sx={{ bgcolor: '#e53935', color: 'white' }} />
                    )}
                  </Box>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {categories.find((c) => c.id === product.category)?.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                    {product.price.toLocaleString('ru-RU')} ₽
                  </Typography>
                  <Chip
                    label={`Склад: ${product.stock} шт`}
                    size="small"
                    color={product.stock > 0 ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => window.open(`/product/${product.slug}`, '_blank')}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(product)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(product.slug)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper>
          {filteredProducts.map((product, index) => (
            <Box
              key={product.id}
              sx={{
                p: 2,
                borderBottom: index < filteredProducts.length - 1 ? '1px solid' : 'none',
                borderColor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'grey.100',
                  backgroundImage: product.main_image
                    ? `url(${product.main_image})`
                    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {categories.find((c) => c.id === product.category)?.name}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 700, minWidth: 120 }}>
                {product.price.toLocaleString('ru-RU')} ₽
              </Typography>
              <Chip
                label={`${product.stock} шт`}
                size="small"
                color={product.stock > 0 ? 'success' : 'error'}
              />
              <Box>
                <IconButton size="small" onClick={() => window.open(`/product/${product.slug}`, '_blank')}>
                  <Visibility />
                </IconButton>
                <IconButton size="small" onClick={() => handleOpenDialog(product)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(product.slug)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Категория</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Категория"
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Материал</InputLabel>
                <Select
                  name="material"
                  value={formData.material}
                  label="Материал"
                  onChange={handleChange}
                >
                  {materials.map((mat) => (
                    <MenuItem key={mat.value} value={mat.value}>
                      {mat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Камень</InputLabel>
                <Select
                  name="gemstone"
                  value={formData.gemstone}
                  label="Камень"
                  onChange={handleChange}
                >
                  {gemstones.map((gem) => (
                    <MenuItem key={gem.value} value={gem.value}>
                      {gem.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Цена (₽)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Вес (г)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Размер"
                name="size"
                value={formData.size}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Количество"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleChange}
                    name="is_active"
                    color="success"
                  />
                }
                label="Активен"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_featured}
                    onChange={handleChange}
                    name="is_featured"
                    color="secondary"
                  />
                }
                label="Рекомендуемый (Хит продаж)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_new}
                    onChange={handleChange}
                    name="is_new"
                    color="secondary"
                  />
                }
                label="Новинка"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: 'secondary.main',
              color: 'primary.main',
            }}
          >
            {editingProduct ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="secondary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' },
        }}
        onClick={() => handleOpenDialog()}
      >
        <Add />
      </Fab>
    </Box>
  );
}
