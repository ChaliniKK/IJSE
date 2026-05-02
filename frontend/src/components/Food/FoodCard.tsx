import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

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
      className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm font-black text-amber-500 shadow-xl shadow-black/5">
          <Star size={16} fill="currentColor" />
          <span>4.5</span>
        </div>
      </div>
      
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
          <span className="text-2xl font-black text-primary">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed h-10">{item.description}</p>
        
        <button 
          className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-primary dark:hover:bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-black/5"
          onClick={() => addToCart(item)}
        >
          <div className="bg-white/20 p-1 rounded-lg">
            <Plus size={18} />
          </div>
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default FoodCard;
