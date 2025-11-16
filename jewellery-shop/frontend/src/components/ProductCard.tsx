import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { ShoppingCart, Favorite, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

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
      none: '',
    };
    return labels[gemstone] || '';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(212, 175, 55, 0.3)',
        },
      }}
    >
      {/* Badges */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {product.is_new && (
          <Chip
            label="NEW"
            size="small"
            sx={{
              backgroundColor: 'secondary.main',
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          />
        )}
        {product.is_featured && (
          <Chip
            label="ХИТ"
            size="small"
            sx={{
              backgroundColor: '#e53935',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          />
        )}
        {!product.in_stock && (
          <Chip
            label="НЕТ В НАЛИЧИИ"
            size="small"
            sx={{
              backgroundColor: 'grey.500',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          />
        )}
      </Box>

      {/* Wishlist Icon */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'secondary.light',
            color: 'white',
          },
        }}
      >
        <Favorite />
      </IconButton>

      {/* Image */}
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
          cursor: 'pointer',
        }}
        onClick={() => navigate(`/product/${product.slug}`)}
      />

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
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
          {getGemstoneLabel(product.gemstone) && ` • ${getGemstoneLabel(product.gemstone)}`}
        </Typography>

        <Typography
          gutterBottom
          variant="h6"
          component="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            mt: 0.5,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            cursor: 'pointer',
            '&:hover': {
              color: 'secondary.main',
            },
          }}
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {product.description}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'secondary.main',
          }}
        >
          {product.price.toLocaleString('ru-RU')} ₽
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          disabled={!product.in_stock}
          sx={{
            backgroundColor: 'secondary.main',
            color: 'primary.main',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
        >
          {product.in_stock ? 'В корзину' : 'Нет в наличии'}
        </Button>
        <IconButton
          onClick={() => navigate(`/product/${product.slug}`)}
          sx={{
            color: 'primary.main',
            border: '1px solid',
            borderColor: 'primary.main',
          }}
        >
          <Visibility />
        </IconButton>
      </CardActions>
    </Card>
  );
}
