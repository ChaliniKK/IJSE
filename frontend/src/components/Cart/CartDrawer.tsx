import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../Payment/PaymentModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, placeOrder, loading } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const order = await placeOrder();
      setLastOrder(order);
      setPaymentModalOpen(true);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  const handlePaymentSuccess = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      onClose();
      navigate('/orders');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Cart</h2>
                <p className="text-sm text-slate-500 font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'} selected</p>
              </div>
              <button 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                onClick={onClose}
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {orderSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Order Placed!</h3>
                  <p className="text-slate-500">Redirecting to your orders...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-lg font-medium text-slate-500">Your cart is empty</p>
                  <button 
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
                    onClick={onClose}
                  >
                    Start Ordering
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{item.name}</h3>
                          <button 
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                            onClick={() => removeFromCart(item.id)}
                            disabled={loading}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-primary font-bold text-lg">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg p-1">
                          <button 
                            className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            disabled={loading}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            disabled={loading}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!orderSuccess && cartItems.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Delivery</span>
                    <span className="text-emerald-500 font-bold uppercase text-xs tracking-wider">Free</span>
                  </div>
                  <div className="flex justify-between text-slate-800 dark:text-white text-xl font-black pt-2">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 disabled:opacity-50" 
                  onClick={handleCheckout} 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      <span>Proceed to Checkout</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
          
          {lastOrder && (
            <PaymentModal 
              isOpen={paymentModalOpen}
              onClose={() => setPaymentModalOpen(false)}
              orderId={lastOrder.id}
              amount={lastOrder.totalAmount}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

