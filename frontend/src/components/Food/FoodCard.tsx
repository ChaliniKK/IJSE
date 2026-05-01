import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './FoodCard.css';

interface FoodItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

const FoodCard: React.FC<{ item: FoodItem }> = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      className="food-card"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="food-image">
        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'} alt={item.name} />
        <div className="food-badge">
          <Star size={14} fill="currentColor" />
          <span>4.5</span>
        </div>
      </div>
      
      <div className="food-info">
        <div className="food-header">
          <h3>{item.name}</h3>
          <span className="price">${item.price.toFixed(2)}</span>
        </div>
        <p className="description">{item.description}</p>
        
        <button className="add-btn" onClick={() => addToCart(item)}>
          <Plus size={20} /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default FoodCard;
