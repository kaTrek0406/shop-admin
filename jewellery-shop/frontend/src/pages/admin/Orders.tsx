import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import { Visibility, Edit } from '@mui/icons-material';
import api from '../../services/api';

interface Order {
  id: number;
  order_number: string;
  user_email: string;
  status: string;
  total_price: string;
  created_at: string;
  items: any[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const statuses = [
    { value: 'pending', label: 'Ожидает', color: 'warning' },
    { value: 'processing', label: 'В обработке', color: 'info' },
    { value: 'shipped', label: 'Отправлен', color: 'primary' },
    { value: 'delivered', label: 'Доставлен', color: 'success' },
    { value: 'cancelled', label: 'Отменен', color: 'error' },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/');
      setOrders(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleChangeStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await api.patch(`/orders/${selectedOrder.id}/update_status/`, {
        status: newStatus,
      });
      setSuccess('Статус заказа обновлен');
      setStatusDialogOpen(false);
      fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Ошибка обновления статуса');
    }
  };

  const getStatusInfo = (status: string) => {
    return statuses.find((s) => s.value === status) || statuses[0];
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          mb: 3,
        }}
      >
        Управление заказами
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Пока нет заказов
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 700 }}>№ Заказа</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Дата</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Клиент</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Сумма</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        #{order.order_number?.slice(0, 8)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>{order.user_email || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {parseFloat(order.total_price || '0').toLocaleString('ru-RU')} ₽
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusInfo.label}
                        color={statusInfo.color as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(order)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleChangeStatus(order)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Детали заказа #{selectedOrder?.order_number?.slice(0, 8)}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Дата заказа
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(selectedOrder.created_at).toLocaleString('ru-RU')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Статус
                  </Typography>
                  <Chip
                    label={getStatusInfo(selectedOrder.status).label}
                    color={getStatusInfo(selectedOrder.status).color as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Email клиента
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedOrder.user_email || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>
                Товары в заказе
              </Typography>
              {selectedOrder.items?.length > 0 ? (
                selectedOrder.items.map((item: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      p: 2,
                      backgroundColor: 'grey.50',
                      borderRadius: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {item.product_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Количество: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {parseFloat(item.price).toLocaleString('ru-RU')} ₽
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Товары не найдены
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Итого:</Typography>
                <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                  {parseFloat(selectedOrder.total_price || '0').toLocaleString('ru-RU')} ₽
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Изменить статус заказа</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={newStatus}
              label="Статус"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            sx={{
              backgroundColor: 'secondary.main',
              color: 'primary.main',
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
