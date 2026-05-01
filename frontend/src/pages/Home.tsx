import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Star, Clock } from 'lucide-react';
import FoodCard from '../components/Food/FoodCard';
import axiosInstance from '../api/axiosConfig';
import './Home.css';

const MOCK_FOOD = [
  { id: 1, name: 'Margherita Pizza', price: 12.99, description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.', imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Double Burger', price: 15.50, description: 'Juicy double beef patty with cheese, lettuce, and secret sauce.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Dragon Roll', price: 18.00, description: 'Tempura shrimp, cucumber, avocado topped with eel sauce.', imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Greek Salad', price: 10.99, description: 'Fresh cucumbers, tomatoes, olives, and feta cheese.', imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400' },
];

const Home: React.FC = () => {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, catRes] = await Promise.all([
          axiosInstance.get('/food'),
          axiosInstance.get('/categories')
        ]);
        setFoodItems(foodRes.data.length > 0 ? foodRes.data : MOCK_FOOD);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setFoodItems(MOCK_FOOD);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* ... Hero section remains same ... */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Delicious Food <br /><span>Delivered</span> to You</h1>
            <p>Order from your favorite restaurants and get the best meals in town, delivered fresh and fast.</p>
            <div className="hero-btns">
              <button className="btn-primary">Order Now</button>
              <button className="btn-secondary">Explore Menu</button>
            </div>
            
            <div className="stats">
              <div className="stat-item">
                <Utensils size={24} />
                <span>50+ Restaurants</span>
              </div>
              <div className="stat-item">
                <Star size={24} />
                <span>4.8 Rating</span>
              </div>
              <div className="stat-item">
                <Clock size={24} />
                <span>30 min Delivery</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" alt="Delicious Food" />
            <div className="floating-card card-1">
              <Star className="text-accent" fill="currentColor" size={16} />
              <span>Top Rated</span>
            </div>
            <div className="floating-card card-2">
              <Clock className="text-primary" size={16} />
              <span>Fast Delivery</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="categories container">
        <h2>Popular Categories</h2>
        <div className="category-grid">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.id} 
              className="category-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {cat.name}
            </motion.div>
          ))}
        </div>
      </section>


      <section className="food-grid-section container">
        <div className="section-header">
          <h2>Featured Meals</h2>
          <button className="view-all">View All</button>
        </div>
        <div className="food-grid">
          {foodItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
