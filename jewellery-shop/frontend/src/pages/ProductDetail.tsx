import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  Add,
  Remove,
} from '@mui/icons-material';
import api from '../services/api';
import { Product } from '../types';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${slug}/`);
      setProduct(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки товара');
    } finally {
      setLoading(false);
    }
  };

  const getMaterialLabel = (material: string) => {
    const labels: Record<string, string> = {
      gold_585: 'Золото 585',
      gold_750: 'Золото 750',
      silver_925: 'Серебро 925',
      platinum: 'Платина',
      white_gold: 'Белое золото',
      rose_gold: 'Розовое золото',
    };
    return labels[material] || material;
  };

  const getGemstoneLabel = (gemstone: string) => {
    const labels: Record<string, string> = {
      diamond: 'Бриллиант',
      emerald: 'Изумруд',
      ruby: 'Рубин',
      sapphire: 'Сапфир',
      topaz: 'Топаз',
      amethyst: 'Аметист',
      cubic_zirconia: 'Фианит',
      none: 'Без камней',
    };
    return labels[gemstone] || gemstone;
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product?.id, quantity);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'secondary.main' }} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Товар не найден'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/catalog')}
          sx={{ mt: 2 }}
        >
          Вернуться в каталог
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Назад
      </Button>

      <Grid container spacing={6}>
        {/* Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              paddingTop: '100%',
              backgroundColor: 'grey.100',
              backgroundImage: product.main_image
                ? `url(${product.main_image})`
                : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
            }}
          >
            {/* Badges */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {product.is_new && (
                <Chip
                  label="NEW"
                  sx={{
                    backgroundColor: 'secondary.main',
                    color: 'primary.main',
                    fontWeight: 700,
                  }}
                />
              )}
              {product.is_featured && (
                <Chip
                  label="ХИТ"
                  sx={{
                    backgroundColor: '#e53935',
                    color: 'white',
                    fontWeight: 700,
                  }}
                />
              )}
            </Box>

            {/* Favorite */}
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'secondary.light',
                  color: 'white',
                },
              }}
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Box>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="caption"
            sx={{
              color: 'secondary.main',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {getMaterialLabel(product.material)}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              mt: 1,
              mb: 2,
            }}
          >
            {product.name}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: 'secondary.main',
              fontWeight: 700,
              mb: 3,
            }}
          >
            {product.price.toLocaleString('ru-RU')} ₽
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Specifications */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Характеристики
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Материал:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {getMaterialLabel(product.material)}
                </Typography>
              </Grid>
              {product.gemstone !== 'none' && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Камень:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {getGemstoneLabel(product.gemstone)}
                  </Typography>
                </Grid>
              )}
              {product.weight && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Вес:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {product.weight} г
                  </Typography>
                </Grid>
              )}
              {product.size && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Размер:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {product.size}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Наличие:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: product.in_stock ? 'success.main' : 'error.main',
                  }}
                >
                  {product.in_stock ? `В наличии (${product.stock} шт)` : 'Нет в наличии'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Описание
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {product.description}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Quantity & Add to Cart */}
          {product.in_stock && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Количество:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                  }}
                >
                  <IconButton
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ px: 3, fontWeight: 600 }}>{quantity}</Typography>
                  <IconButton
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                sx={{
                  backgroundColor: 'secondary.main',
                  color: 'primary.main',
                  fontWeight: 600,
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: 'secondary.dark',
                  },
                }}
              >
                Добавить в корзину
              </Button>
            </>
          )}

          {!product.in_stock && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Товар временно отсутствует. Свяжитесь с нами для уточнения сроков поставки.
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
