import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, LayoutDashboard, Utensils, List as ListIcon, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface FoodItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category?: Category;
}

const AdminDashboard: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'foods' | 'categories'>('foods');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    description: '',
    categoryId: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [foodsRes, catsRes] = await Promise.all([
        axiosInstance.get('/food'),
        axiosInstance.get('/categories')
      ]);
      setFoods(foodsRes.data);
      setCategories(catsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'foods') {
      setFormData({
        name: item.name,
        price: item.price.toString(),
        imageUrl: item.imageUrl,
        description: item.description,
        categoryId: item.category?.id.toString() || ''
      });
    } else {
      setFormData({ ...formData, name: item.name });
    }
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (activeTab === 'foods') {
        await axiosInstance.delete(`/food/${id}`);
      } else {
        await axiosInstance.delete(`/categories/${id}`);
      }
      fetchInitialData();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'foods') {
        const payload = {
          name: formData.name,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl,
          description: formData.description,
          category: { id: parseInt(formData.categoryId) }
        };
        if (editingItem) {
          await axiosInstance.put(`/food/${editingItem.id}`, payload);
        } else {
          await axiosInstance.post('/food', payload);
        }
      } else {
        if (editingItem) {
          await axiosInstance.put(`/categories/${editingItem.id}`, { name: formData.name });
        } else {
          await axiosInstance.post('/categories', { name: formData.name });
        }
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '', price: '', imageUrl: '', description: '', categoryId: '' });
      fetchInitialData();
    } catch (error) {
      alert('Operation failed');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-120px)] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">Admin Panel</span>
        </div>
        
        <nav className="space-y-2">
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'foods' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            onClick={() => setActiveTab('foods')}
          >
            <Utensils size={20} /> Foods
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'categories' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            <ListIcon size={20} /> Categories
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 space-y-10 overflow-x-hidden">
        <header className="flex flex-wrap justify-between items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p className="text-slate-500 text-sm">Add, edit, or remove {activeTab} from your menu</p>
          </div>
          <button 
            className="px-8 py-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
            onClick={() => { setEditingItem(null); setShowModal(true); }}
          >
            <Plus size={20} /> Add New
          </button>
        </header>

        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                {activeTab === 'foods' ? (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Food</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {activeTab === 'foods' ? (
                foods.map(food => (
                  <tr key={food.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={food.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                        <span className="font-bold text-slate-800 dark:text-white">{food.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500">
                        {food.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">${food.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors" onClick={() => handleEdit(food)}><Edit2 size={18} /></button>
                        <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors" onClick={() => handleDelete(food.id)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-slate-400">#{cat.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{cat.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors" onClick={() => handleEdit(cat)}><Edit2 size={18} /></button>
                        <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors" onClick={() => handleDelete(cat.id)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{editingItem ? 'Edit' : 'Add'} {activeTab === 'foods' ? 'Food' : 'Category'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required 
                />
              </div>
              
              {activeTab === 'foods' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Price</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={formData.price} 
                        onChange={(e) => setFormData({...formData, price: e.target.value})} 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Category</label>
                      <select 
                        value={formData.categoryId} 
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})} 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                        required
                      >
                        <option value="">Select</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Image URL</label>
                    <input 
                      type="text" 
                      value={formData.imageUrl} 
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Description</label>
                    <textarea 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all h-24"
                      required 
                    />
                  </div>
                </>
              )}
              
              <div className="flex gap-4 pt-4">
                <button type="button" className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
