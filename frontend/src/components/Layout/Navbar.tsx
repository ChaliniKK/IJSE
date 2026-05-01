import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          Food<span>ie</span>
        </Link>

        <div className="search-bar">
          <Search size={20} />
          <input type="text" placeholder="Search for food..." />
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          
          <div className="cart-icon" onClick={onCartClick}>
            <ShoppingCart size={24} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>

          {isAuthenticated ? (
            <div className="user-profile">
              <User size={24} />
              <div className="dropdown">
                <p className="user-name">{user?.username}</p>
                <div className="dropdown-divider"></div>
                <Link to="/orders" className="dropdown-item">My Orders</Link>
                {user?.roles.includes('ROLE_ADMIN') && (
                  <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                )}
                <div className="dropdown-divider"></div>
                <button onClick={logout} className="logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
