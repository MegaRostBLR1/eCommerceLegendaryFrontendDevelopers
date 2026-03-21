import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../services/api-client';
import { authorizationService } from '../../services/authorization-service';
import { Card } from '../../components/card/card';
import type { Order, OrdersResponse, Service } from '../../types';
import { Pagination, CircularProgress } from '@mui/material';
import OpenOrderForm from '../../components/modals/OrderForm/OrderForm';
import './OrdersPage.css';

export const OrdersPage = () => {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const targetId = paramUserId || authorizationService.getUserId();
      if (!targetId) {
        setLoading(false);
        return;
      }

      const url = `/orders/user/${targetId}?page=${page}&count=8`;
      const response = await apiClient.request<OrdersResponse>(url);
      setOrders(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error('Fetch orders failed:', error);
    } finally {
      setLoading(false);
    }
  }, [page, paramUserId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const mapOrderToService = (order: Order): Service => ({
    id: order.id,
    name: order.name,
    amount: order.price,
    discount: order.discount,
    description: order.description || 'No description provided',
    workersCount: order.quantity,
    duration: 0,
    categories: [],
  });

  if (loading) {
    return (
      <div className="loaderContainer">
        <CircularProgress sx={{ color: '#074733' }} />
      </div>
    );
  }

  return (
    <div className="catalog-container orders-page-container">
      <h2 className="title">
        {paramUserId ? `User Orders #${paramUserId}` : 'My Orders'}
      </h2>

      {orders.length === 0 ? (
        <div
          className="no-data"
          style={{ textAlign: 'center', marginTop: '50px' }}
        >
          <p>No orders found for this user.</p>
        </div>
      ) : (
        <>
          <div className="orders-grid-layout">
            {orders.map((order) => (
              <div
                key={order.id}
                className="order-item-wrapper"
                onClick={() => handleEditOrder(order)}
                style={{ cursor: 'pointer' }}
              >
                <div className="order-date-text" style={{ textAlign: 'right' }}>
                  {new Date(order.startDate).toLocaleDateString()}
                </div>

                <Card
                  data={mapOrderToService(order)}
                  isAdminMode={false}
                  isOrderCard={true}
                  handleClick={() => {}}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => setPage(v)}
                sx={{
                  '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: '#074733',
                    color: '#fff',
                  },
                }}
              />
            </div>
          )}
        </>
      )}

      {selectedOrder && (
        <OpenOrderForm
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          service={mapOrderToService(selectedOrder)}
          orderId={selectedOrder.id}
          isEdit={true}
          onRefresh={fetchOrders}
          initialDate={selectedOrder.startDate}
        />
      )}
    </div>
  );
};
