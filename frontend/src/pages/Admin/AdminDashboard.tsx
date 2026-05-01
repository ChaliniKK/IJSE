import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Plus, Edit2, Trash2, LayoutDashboard, Utensils, List as ListIcon } from 'lucide-react';
import './AdminDashboard.css';

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
  const [activeTab, setActiveTab] = useState<'foods' | 'categories' | 'orders'>('foods');
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
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <LayoutDashboard size={24} />
          <span>Admin Panel</span>
        </div>
        <nav>
          <button className={activeTab === 'foods' ? 'active' : ''} onClick={() => setActiveTab('foods')}>
            <Utensils size={20} /> Foods
          </button>
          <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>
            <ListIcon size={20} /> Categories
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <button className="btn-primary" onClick={() => { setEditingItem(null); setShowModal(true); }}>
            <Plus size={20} /> Add New
          </button>
        </header>

        <div className="admin-content">
          <table className="admin-table">
            <thead>
              {activeTab === 'foods' ? (
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              ) : (
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {activeTab === 'foods' ? (
                foods.map(food => (
                  <tr key={food.id}>
                    <td><img src={food.imageUrl} alt="" className="table-img" /></td>
                    <td>{food.name}</td>
                    <td>{food.category?.name || 'N/A'}</td>
                    <td>${food.price.toFixed(2)}</td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(food)}><Edit2 size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(food.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                categories.map(cat => (
                  <tr key={cat.id}>
                    <td>#{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(cat)}><Edit2 size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(cat.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingItem ? 'Edit' : 'Add'} {activeTab === 'foods' ? 'Food' : 'Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              
              {activeTab === 'foods' && (
                <>
                  <div className="form-group">
                    <label>Price</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input 
                      type="text" 
                      value={formData.imageUrl} 
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      value={formData.categoryId} 
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})} 
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
