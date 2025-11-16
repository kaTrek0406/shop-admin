import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Inventory,
  People,
  AttachMoney,
} from '@mui/icons-material';
import api from '../../services/api';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products/'),
        api.get('/orders/'),
      ]);

      const products = productsRes.data.results || productsRes.data;
      const orders = ordersRes.data.results || ordersRes.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total_price || 0), 0);
      const uniqueCustomers = new Set(orders.map((o: any) => o.user)).size;

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: uniqueCustomers,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Общая выручка',
      value: `${stats.totalRevenue.toLocaleString('ru-RU')} ₽`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      growth: stats.revenueGrowth,
    },
    {
      title: 'Всего заказов',
      value: stats.totalOrders.toString(),
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      growth: stats.ordersGrowth,
    },
    {
      title: 'Товаров',
      value: stats.totalProducts.toString(),
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      growth: 0,
    },
    {
      title: 'Клиентов',
      value: stats.totalCustomers.toString(),
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      growth: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Ожидает',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    };
    return labels[status] || status;
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          mb: 4,
        }}
      >
        Дашборд
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {card.value}
                    </Typography>
                    {card.growth > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUp sx={{ fontSize: 16 }} />
                        <Typography variant="body2">+{card.growth}%</Typography>
                      </Box>
                    )}
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      width: 56,
                      height: 56,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Последние заказы
        </Typography>
        {recentOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Пока нет заказов
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>№ Заказа</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Дата</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Клиент</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Сумма</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.order_number?.slice(0, 8)}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>{order.user_email || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {parseFloat(order.total_price || 0).toLocaleString('ru-RU')} ₽
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
