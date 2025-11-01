import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "@/utils/axios.instance";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  Star,
  Eye,
  X,
  Upload,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form states
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    category_id: "",
    image: null,
    other_images: []
  });
  
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    category_id: ""
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/product/getProducts");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category/categories");
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category_id.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handle Add Product
  const handleAddProduct = async () => {
    if (!addForm.name || !addForm.price || !addForm.category_id || !addForm.image) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", addForm.name);
    formData.append("description", addForm.description);
    formData.append("price", addForm.price);
    formData.append("rating", addForm.rating || "4.0");
    formData.append("category_id", addForm.category_id);
    formData.append("image", addForm.image);

    // Append other images
    addForm.other_images.forEach((file, index) => {
      formData.append("other_images", file);
    });

    try {
      setLoading(true)
      await axios.post("/product/addProduct", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully");
      setAddModalOpen(false);
      resetAddForm();
      fetchProducts();
      setLoading(false)
      
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
      setLoading(false)
    }
  };

  // Handle Edit Product
  const handleEditProduct = async () => {
    try {
      await axios.patch(`/product/edit/${selectedProduct.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product updated successfully");
      setEditModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/product/delete/${selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      setDeleteModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Form handlers
  const resetAddForm = () => {
    setAddForm({
      name: "",
      description: "",
      price: "",
      rating: "",
      category_id: "",
      image: null,
      other_images: []
    });
  };

  const handleAddImage = (e, field) => {
    const files = Array.from(e.target.files);
    if (field === "image") {
      setAddForm({ ...addForm, image: files[0] });
    } else if (field === "other_images") {
      const currentImages = addForm.other_images || [];
      const newImages = [...currentImages, ...files].slice(0, 3); // Max 3 images
      setAddForm({ ...addForm, other_images: newImages });
    }
  };

  const removeOtherImage = (index) => {
    const newImages = addForm.other_images.filter((_, i) => i !== index);
    setAddForm({ ...addForm, other_images: newImages });
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      rating: product.rating,
      category_id: product.category_id
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-accent/20 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted/50 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="text-sm text-muted-foreground flex items-center">
              <Package className="h-4 w-4 mr-2" />
              {filteredProducts.length} products found
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedProducts.map(product => (
            <div key={product.id} className="bg-card rounded-xl border border-accent/20 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Product Image */}
              <div className="relative h-78 bg-muted/30 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="p-2 bg-black/70 text-white text-xs rounded-full">
                    {product.category_name}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg text-foreground">
                    {formatCurrency(parseFloat(product.price))}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === page 
                        ? 'bg-accent text-accent-foreground' 
                        : 'border border-accent/20 hover:bg-accent/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all" 
                ? "Try adjusting your search or filters"
                : "Get started by adding your first product"
              }
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors mx-auto"
            >
              <Plus className="h-5 w-5" />
              Add First Product
            </button>
          </div>
        )}

        {/* Add Product Modal */}
        {addModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl border border-accent/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Add New Product</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={addForm.category_id}
                    onChange={(e) => setAddForm({...addForm, category_id: e.target.value})}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                  rows="3"
                  className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addForm.price}
                    onChange={(e) => setAddForm({...addForm, price: e.target.value})}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={addForm.rating}
                    onChange={(e) => setAddForm({...addForm, rating: e.target.value})}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="4.0"
                  />
                </div>
              </div>

              {/* Main Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Main Image *</label>
                <div className="border-2 border-dashed border-accent/20 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAddImage(e, "image")}
                    className="hidden"
                    id="main-image"
                  />
                  <label htmlFor="main-image" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {addForm.image ? addForm.image.name : "Click to upload main image"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Additional Images Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Additional Images (Max 3)</label>
                <div className="border-2 border-dashed border-accent/20 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleAddImage(e, "other_images")}
                    className="hidden"
                    id="other-images"
                  />
                  <label htmlFor="other-images" className="cursor-pointer block text-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload additional images</p>
                  </label>
                  
                  {/* Preview other images */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {addForm.other_images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="w-16 h-16 rounded object-cover border"
                        />
                        <button
                          onClick={() => removeOtherImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setAddModalOpen(false);
                    resetAddForm();
                  }}
                  className="flex-1 py-3 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddProduct}
                  className="flex-1 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl border border-accent/20 p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Product</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows="3"
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editForm.rating}
                    onChange={(e) => setEditForm({...editForm, rating: e.target.value})}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={editForm.category_id}
                    onChange={(e) => setEditForm({...editForm, category_id: e.target.value})}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-3 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditProduct}
                  className="flex-1 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl border border-accent/20 p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Product</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete <strong>"{selectedProduct.name}"</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-3 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteProduct}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;