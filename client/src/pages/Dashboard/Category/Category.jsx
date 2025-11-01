import React, { useState, useEffect } from 'react';
import {  Plus,  Edit2, Trash2,  Search, Loader2,  X, Check} from 'lucide-react';
import axios from './../../../utils/axios.instance';
import { toast } from "sonner";
const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/category/categories');
      setCategories(response.data.data);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const addCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/category/addCategory', 
        { name: formData.name },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success('Category added successfully!')
      setShowAddModal(false);
      setFormData({ name: '' });
      fetchCategories();
    } catch (err) {
      toast.error('Failed to add category')
      console.error('Error adding category:', err);
    } finally {
      setLoading(false);
    }
  };

  // Edit category
  const editCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/category/edit/${selectedCategory.id}`,
        { name: formData.name },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success('Category updated successfully!')
      setShowEditModal(false);
      setFormData({ name: '' });
      setSelectedCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to update category')
      console.error('Error updating category:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/category/delete/${selectedCategory.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Category deleted successfully!')
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category')
      console.error('Error deleting category:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name });
    setShowEditModal(true);
  };

  // Open delete modal
  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };
  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset modals
  const resetModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setFormData({ name: '' });
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground font-bungee">Categories</h1>
        <p className="text-muted-foreground mt-2">Manage your product categories</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {loading && !categories.length ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground text-lg">
            {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground text-lg truncate">
                  {category.name}
                </h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  ID: {category.id}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors text-sm font-medium"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-destructive/70 text-background rounded-md hover:bg-destructive/80 transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">Add New Category</h2>
            <form onSubmit={addCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetModals}
                  className="px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">Edit Category</h2>
            <form onSubmit={editCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetModals}
                  className="px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">Delete Category</h2>
            <p className="text-foreground mb-6">
              Are you sure you want to delete <strong>"{selectedCategory?.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={resetModals}
                className="px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteCategory}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-destructive/70 text-background rounded-lg hover:bg-destructive/80 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;