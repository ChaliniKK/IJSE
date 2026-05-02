import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await axiosInstance.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 p-10 space-y-10"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500">Join Foodie and start ordering today</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                name="name"
                type="text" 
                placeholder="Enter your full name" 
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                name="email"
                type="email" 
                placeholder="name@example.com" 
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <span>Register</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-bold">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
