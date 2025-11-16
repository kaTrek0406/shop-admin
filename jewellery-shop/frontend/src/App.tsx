import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';

// Placeholder components for pages we haven't created yet
const CartPage = () => <Box p={4}><h1>Корзина</h1><p>Страница в разработке</p></Box>;
const ProfilePage = () => <Box p={4}><h1>Личный кабинет</h1><p>Страница в разработке</p></Box>;
const OrdersPage = () => <Box p={4}><h1>Мои заказы</h1><p>Страница в разработке</p></Box>;
const WishlistPage = () => <Box p={4}><h1>Избранное</h1><p>Страница в разработке</p></Box>;
const AboutPage = () => <Box p={4}><h1>О нас</h1><p>Страница в разработке</p></Box>;
const ContactPage = () => <Box p={4}><h1>Контакты</h1><p>Страница в разработке</p></Box>;
const AdminCustomersPage = () => <Box p={4}><h1>Клиенты</h1><p>Страница в разработке</p></Box>;
const AdminSettingsPage = () => <Box p={4}><h1>Настройки</h1><p>Страница в разработке</p></Box>;

function App() {
  return (
    <Routes>
      {/* Public routes with Header/Footer */}
      <Route path="/" element={
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <Home />
          </Box>
          <Footer />
        </Box>
      } />
      <Route path="/catalog" element={
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <Catalog />
          </Box>
          <Footer />
        </Box>
      } />
      <Route path="/product/:slug" element={
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <ProductDetail />
          </Box>
          <Footer />
        </Box>
      } />
      <Route path="/cart" element={
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <CartPage />
          </Box>
          <Footer />
        </Box>
      } />
      <Route path="/profile" element={
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <ProfilePage />
          </Box>
          <Footer />
        </Box>
      } />
      <Route path="/orders" element={
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <OrdersPage />
          </Box>
          <Footer />
        </Box>
      } />
      <Route path="/wishlist" element={
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <WishlistPage />
          </Box>
          <Footer />
        </Box>
      } />
      <Route path="/about" element={
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <AboutPage />
          </Box>
          <Footer />
        </Box>
      } />
      <Route path="/contact" element={
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <ContactPage />
          </Box>
          <Footer />
        </Box>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
