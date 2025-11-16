import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Diamond,
  LocalShipping,
  VerifiedUser,
  WorkspacePremium,
  ArrowForward,
} from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { Product } from '../types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, newItems] = await Promise.all([
          api.get('/products/featured/'),
          api.get('/products/new/'),
        ]);
        setFeaturedProducts(featured.data.results || featured.data);
        setNewProducts(newItems.data.results || newItems.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const features = [
    {
      icon: <Diamond sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Премиум качество',
      description: 'Только сертифицированные драгоценные камни и металлы',
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Бесплатная доставка',
      description: 'По Москве и области при заказе от 50 000 ₽',
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Гарантия качества',
      description: 'Пожизненная гарантия на все изделия',
    },
    {
      icon: <WorkspacePremium sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Эксклюзивность',
      description: 'Уникальные дизайны и индивидуальные заказы',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: 'white',
          py: { xs: 8, md: 15 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  mb: 2,
                  background: 'linear-gradient(45deg, #d4af37 30%, #f4e5a4 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Роскошь в каждой детали
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 300,
                }}
              >
                Эксклюзивные ювелирные изделия, созданные для тех, кто ценит истинную красоту
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/catalog')}
                  sx={{
                    backgroundColor: 'secondary.main',
                    color: 'primary.main',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'secondary.dark',
                    },
                  }}
                >
                  Смотреть каталог
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/about')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      color: 'secondary.main',
                    },
                  }}
                >
                  О нас
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 400 },
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Diamond sx={{ fontSize: { xs: 150, md: 250 }, color: 'secondary.main', opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent>
                  {feature.icon}
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                textAlign: 'center',
                mb: 1,
              }}
            >
              Рекомендуемые товары
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 6,
              }}
            >
              Лучшие изделия нашей коллекции
            </Typography>
            <Grid container spacing={4}>
              {featuredProducts.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
            }}
          >
            Новинки
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
            }}
          >
            Только что поступили в продажу
          </Typography>
          <Grid container spacing={4}>
            {newProducts.slice(0, 4).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/catalog')}
              sx={{
                borderColor: 'secondary.main',
                color: 'secondary.main',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  borderColor: 'secondary.dark',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                },
              }}
            >
              Смотреть весь каталог
            </Button>
          </Box>
        </Container>
      )}

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d4af37 0%, #c49b33 100%)',
          color: 'primary.main',
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Создайте уникальное украшение
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Наши мастера воплотят в жизнь ваши самые смелые идеи
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/contact')}
            sx={{
              backgroundColor: 'primary.main',
              color: 'secondary.main',
              fontWeight: 600,
              px: 5,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#0f0f1e',
              },
            }}
          >
            Связаться с нами
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
