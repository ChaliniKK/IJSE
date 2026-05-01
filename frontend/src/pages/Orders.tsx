import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import './Orders.css';

interface OrderItem {
  id: number;
  foodItem: {
    name: string;
    imageUrl: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: 'PLACED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  orderItems: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await axiosInstance.get(`/orders/user/${user.id}`);
      setOrders(response.data.sort((a: Order, b: Order) => 
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      ));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axiosInstance.put(`/orders/${orderId}/cancel`);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle size={18} className="status-icon delivered" />;
      case 'CANCELLED': return <XCircle size={18} className="status-icon cancelled" />;
      default: return <Clock size={18} className="status-icon pending" />;
    }
  };

  if (loading) return <div className="loading-screen">Loading orders...</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your recent orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <Package size={64} />
          <h3>No orders yet</h3>
          <p>Go ahead and order some delicious food!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`order-status ${order.status.toLowerCase()}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              <div className="order-items">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.foodItem.imageUrl} alt={item.foodItem.name} />
                    <div className="item-info">
                      <h4>{item.foodItem.name}</h4>
                      <span>Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total Amount</span>
                  <h3>${order.totalAmount.toFixed(2)}</h3>
                </div>
                {order.status === 'PLACED' && (
                  <button 
                    className="btn-outline-danger"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
