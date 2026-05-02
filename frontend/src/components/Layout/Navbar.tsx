import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Utensils, Clock, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems, searchQuery, setSearchQuery } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-1 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Utensils size={24} />
            </div>
            Food<span className="text-primary">ie</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for delicious food..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onCartClick}
              className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group"
            >
              <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg shadow-primary/20">
                  {totalItems}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-3 p-1 pr-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {user?.name?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 hidden sm:block">{user?.name}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-2">
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                      <Clock size={18} /> My Orders
                    </Link>
                    {user?.role === 'ROLE_ADMIN' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <Star size={18} /> Admin Dashboard
                      </Link>
                    )}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
