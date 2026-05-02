import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Star, Clock } from 'lucide-react';
import FoodCard from '../components/Food/FoodCard';
import axiosInstance from '../api/axiosConfig';
import { useCart } from '../context/CartContext';

const MOCK_FOOD = [
  { id: 1, name: 'Margherita Pizza', price: 12.99, description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.', imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Double Burger', price: 15.50, description: 'Juicy double beef patty with cheese, lettuce, and secret sauce.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Dragon Roll', price: 18.00, description: 'Tempura shrimp, cucumber, avocado topped with eel sauce.', imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Greek Salad', price: 10.99, description: 'Fresh cucumbers, tomatoes, olives, and feta cheese.', imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400' },
];

const Home: React.FC = () => {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { searchQuery } = useCart();
  const mealsRef = useRef<HTMLDivElement>(null);

  const scrollToMeals = () => {
    mealsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [showAllFood, setShowAllFood] = useState(false);

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

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory ? item.category?.id === selectedCategory : true;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedItems = showAllFood ? filteredItems : filteredItems.slice(0, 6);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-8 md:px-16 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-hover text-sm font-bold tracking-wide uppercase">
              ✨ 50% Off your first order
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Delicious Food <br />
              <span className="text-primary italic">Delivered</span> to You
            </h1>
            <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
              Experience the best culinary delights from your favorite local restaurants, delivered fresh and fast to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={scrollToMeals}
                className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
              >
                Order Now
              </button>
              <button 
                onClick={scrollToMeals}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl font-bold transition-all"
              >
                Explore Menu
              </button>
            </div>
            
            <div className="flex gap-8 pt-8">
              {[
                { icon: Utensils, label: '50+ Restaurants' },
                { icon: Star, label: '4.8 Rating' },
                { icon: Clock, label: '30 min Delivery' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-primary">
                    <stat.icon size={24} />
                  </div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" 
                alt="Delicious Food" 
                className="w-full aspect-square object-cover"
              />
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <Star fill="currentColor" size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-white">Top Rated</div>
                <div className="text-xs text-slate-500">Best in Town</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <Clock size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-white">Fast Delivery</div>
                <div className="text-xs text-slate-500">Under 20 mins</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Popular Categories</h2>
            <p className="text-slate-500">Choose from our curated collection of delicious meals</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <motion.button 
            onClick={() => setSelectedCategory(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-sm ${
              selectedCategory === null 
              ? 'bg-primary text-white shadow-primary/20' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 border border-slate-100 dark:border-slate-800'
            }`}
          >
            All Items
          </motion.button>
          {categories.map((cat, i) => (
            <motion.button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-sm ${
                selectedCategory === cat.id 
                ? 'bg-primary text-white shadow-primary/20' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 border border-slate-100 dark:border-slate-800'
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Food Grid Section */}
      <section ref={mealsRef} className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Featured'} Meals
          </h2>
          <button 
            onClick={() => setShowAllFood(!showAllFood)}
            className="text-primary font-bold hover:underline"
          >
            {showAllFood ? 'Show Less' : 'View All Meals'}
          </button>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Utensils size={48} className="text-slate-300" />
            <p className="text-xl font-medium text-slate-500">No food items found matching your criteria.</p>
            <button onClick={() => {setSelectedCategory(null)}} className="text-primary font-bold">Clear filters</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
