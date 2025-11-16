import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, Email, Phone, LocationOn } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* About */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #d4af37 30%, #f4e5a4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              JEWELLERY
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Эксклюзивные ювелирные изделия с бриллиантами, изумрудами и драгоценными камнями.
              Качество, элегантность и индивидуальность в каждом украшении.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: 'secondary.main' }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'secondary.main' }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'secondary.main' }}>
                <Twitter />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
              Меню
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Главная
              </Link>
              <Link href="/catalog" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Каталог
              </Link>
              <Link href="/about" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                О нас
              </Link>
              <Link href="/contact" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Контакты
              </Link>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
              Категории
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/catalog?category=rings" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Кольца
              </Link>
              <Link href="/catalog?category=earrings" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Серьги
              </Link>
              <Link href="/catalog?category=bracelets" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Браслеты
              </Link>
              <Link href="/catalog?category=necklaces" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Цепочки
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
              Контакты
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: 'secondary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  +7 (495) 123-45-67
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: 'secondary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  info@jewellery.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <LocationOn sx={{ color: 'secondary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Москва, ул. Тверская, д. 1
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)', mt: 4, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} JEWELLERY. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
