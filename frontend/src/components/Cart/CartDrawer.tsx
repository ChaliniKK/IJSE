import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, placeOrder, loading } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await placeOrder();
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        onClose();
        navigate('/orders');
      }, 2000);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="cart-header">
              <h2>Your Cart ({totalItems})</h2>
              <button className="close-btn" onClick={onClose}><X size={24} /></button>
            </div>

            <div className="cart-items">
              {orderSuccess ? (
                <div className="success-state">
                  <CheckCircle size={64} color="#10b981" />
                  <h3>Order Placed!</h3>
                  <p>Redirecting to your orders...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={64} />
                  <p>Your cart is empty</p>
                  <button className="btn-primary" onClick={onClose}>Start Ordering</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                      <div className="item-controls">
                        <div className="quantity-btns">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={loading}>
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={loading}>
                            <Plus size={16} />
                          </button>
                        </div>
                        <button className="delete-btn" onClick={() => removeFromCart(item.id)} disabled={loading}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!orderSuccess && cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  className="checkout-btn" 
                  onClick={handleCheckout} 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Proceed to Checkout'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

