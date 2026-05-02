import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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
      setLoading(true);
      const response = await axiosInstance.get(`/orders/user/${user.id}`);
      const sortedOrders = (response.data || []).sort((a: Order, b: Order) => {
        const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
        const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
        return dateB - dateA;
      });
      setOrders(sortedOrders);
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'DELIVERED': 
        return { 
          bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400', 
          icon: <CheckCircle size={18} /> 
        };
      case 'CANCELLED': 
        return { 
          bg: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400', 
          icon: <XCircle size={18} /> 
        };
      case 'READY':
        return { 
          bg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400', 
          icon: <Clock size={18} /> 
        };
      case 'PREPARING':
        return { 
          bg: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400', 
          icon: <Clock size={18} className="animate-pulse" /> 
        };
      default: 
        return { 
          bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400', 
          icon: <Clock size={18} /> 
        };
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Order History</h1>
        <p className="text-slate-500">Track and manage your recent orders</p>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
            <Package size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">No orders yet</h3>
            <p className="text-slate-500">Go ahead and order some delicious food!</p>
          </div>
          <a href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
            Browse Menu
          </a>
        </div>
      ) : (
        <div className="grid gap-8">
          {orders.map((order) => {
            const status = getStatusStyles(order.status);
            return (
              <motion.div 
                key={order.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-slate-800 dark:text-white">Order #{order.id}</span>
                      <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2 ${status.bg}`}>
                        {status.icon}
                        {order.status}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      {new Date(order.orderDate).toLocaleDateString(undefined, { dateStyle: 'long' })} at {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1 uppercase tracking-wider font-semibold">Total Amount</p>
                    <p className="text-3xl font-black text-primary">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 group">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md">
                        <img 
                          src={item.foodItem.imageUrl} 
                          alt={item.foodItem.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{item.foodItem.name}</h4>
                        <p className="text-slate-500">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{item.quantity}</span> × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right font-bold text-slate-800 dark:text-white">
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                   <div className="flex gap-4">
                     {/* Could add Re-order button here */}
                   </div>
                   {order.status === 'PLACED' && (
                    <button 
                      className="px-6 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 rounded-xl font-bold text-sm transition-colors"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
