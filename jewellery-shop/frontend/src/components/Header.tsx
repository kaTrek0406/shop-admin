import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Favorite,
  Dashboard,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isAuthenticated = !!localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    handleClose();
    navigate('/');
  };

  const menuItems = [
    { label: 'Главная', path: '/' },
    { label: 'Каталог', path: '/catalog' },
    { label: 'О нас', path: '/about' },
    { label: 'Контакты', path: '/contact' },
  ];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <>
            <ListItem button component={Link} to="/profile" onClick={() => setMobileOpen(false)}>
              <ListItemText primary="Профиль" />
            </ListItem>
            {userRole === 'admin' && (
              <ListItem button component={Link} to="/admin" onClick={() => setMobileOpen(false)}>
                <ListItemText primary="Админ-панель" />
              </ListItem>
            )}
            <ListItem button onClick={() => { setMobileOpen(false); handleLogout(); }}>
              <ListItemText primary="Выйти" />
            </ListItem>
          </>
        )}
        {!isAuthenticated && (
          <ListItem button component={Link} to="/login" onClick={() => setMobileOpen(false)}>
            <ListItemText primary="Войти" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'primary.main', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Mobile Menu */}
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #d4af37 30%, #f4e5a4 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: 1,
                }}
              >
                JEWELLERY
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 3, ml: 6 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        color: 'secondary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right Side Icons */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton color="inherit" component={Link} to="/wishlist">
                <Badge badgeContent={0} color="secondary">
                  <Favorite />
                </Badge>
              </IconButton>

              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={0} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isAuthenticated ? (
                <>
                  {userRole === 'admin' && (
                    <IconButton color="inherit" component={Link} to="/admin">
                      <Dashboard />
                    </IconButton>
                  )}
                  <IconButton color="inherit" onClick={handleMenu}>
                    <Person />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                      Профиль
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); navigate('/orders'); }}>
                      Мои заказы
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  component={Link}
                  to="/login"
                  sx={{
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    '&:hover': {
                      borderColor: 'secondary.light',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    },
                  }}
                >
                  Войти
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
}
