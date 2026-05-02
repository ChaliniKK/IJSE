import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Layout/Navbar';
import CartDrawer from './components/Cart/CartDrawer';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Orders from './pages/Orders';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { PrivateRoute, AdminRoute } from './components/Auth/ProtectedRoutes';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-300">
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected User Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/orders" element={<Orders />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;

