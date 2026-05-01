import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from './AuthContext';

interface FoodItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface CartItem {
  id: number; // This will be the cart item ID from backend
  foodItem: FoodItem;
  quantity: number;
}

// Local interface for what the UI expects
interface UICartItem extends FoodItem {
  quantity: number;
  cartItemId?: number;
}

interface CartContextType {
  cartItems: UICartItem[];
  addToCart: (item: FoodItem) => Promise<void>;
  removeFromCart: (foodId: number) => Promise<void>;
  updateQuantity: (foodId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: () => Promise<any>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<UICartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/cart/${user.id}`);
      const backendCartItems = response.data.cartItems || [];
      const formattedItems: UICartItem[] = backendCartItems.map((item: any) => ({
        ...item.foodItem,
        quantity: item.quantity,
        cartItemId: item.id
      }));
      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (item: FoodItem) => {
    if (!isAuthenticated || !user) {
      // For unauthenticated users, maybe just alert or redirect
      alert('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(`/cart/${user.id}/add`, {
        foodItemId: item.id,
        quantity: 1
      });
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (foodId: number) => {
    if (!isAuthenticated || !user) return;
    const item = cartItems.find(i => i.id === foodId);
    if (!item || !item.cartItemId) return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/cart/item/${item.cartItemId}`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (foodId: number, quantity: number) => {
    if (!isAuthenticated || !user) return;
    if (quantity <= 0) {
      await removeFromCart(foodId);
      return;
    }

    const item = cartItems.find(i => i.id === foodId);
    if (!item || !item.cartItemId) return;

    try {
      setLoading(true);
      await axiosInstance.put(`/cart/item/${item.cartItemId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/cart/${user.id}/clear`);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!isAuthenticated || !user) return;
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/orders/place/${user.id}`);
      setCartItems([]); // Clear local cart
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, placeOrder, totalItems, totalPrice, loading 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

