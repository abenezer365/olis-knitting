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
  X,
  Upload,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function Products() {
    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },[]);
  
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
    colorInput: "",
    sizeInput: "",
    colorsArray: [],
    sizesArray: [],
    image: null,
    other_images: []
  });
  
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    category_id: "",
    colorInput: "",
    sizeInput: "",
    colorsArray: [],
    sizesArray: []
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

  // Color & Size handlers for Add Product
  const addColor = () => {
    if (addForm.colorInput.trim()) {
      setAddForm({
        ...addForm,
        colorsArray: [...addForm.colorsArray, addForm.colorInput.trim()],
        colorInput: ""
      });
    }
  };

  const removeColor = (index) => {
    setAddForm({
      ...addForm,
      colorsArray: addForm.colorsArray.filter((_, i) => i !== index)
    });
  };

  const addSize = () => {
    if (addForm.sizeInput.trim()) {
      setAddForm({
        ...addForm,
        sizesArray: [...addForm.sizesArray, addForm.sizeInput.trim()],
        sizeInput: ""
      });
    }
  };

  const removeSize = (index) => {
    setAddForm({
      ...addForm,
      sizesArray: addForm.sizesArray.filter((_, i) => i !== index)
    });
  };

  // Color & Size handlers for Edit Product
  const addEditColor = () => {
    if (editForm.colorInput.trim()) {
      setEditForm({
        ...editForm,
        colorsArray: [...editForm.colorsArray, editForm.colorInput.trim()],
        colorInput: ""
      });
    }
  };

  const removeEditColor = (index) => {
    setEditForm({
      ...editForm,
      colorsArray: editForm.colorsArray.filter((_, i) => i !== index)
    });
  };

  const addEditSize = () => {
    if (editForm.sizeInput.trim()) {
      setEditForm({
        ...editForm,
        sizesArray: [...editForm.sizesArray, editForm.sizeInput.trim()],
        sizeInput: ""
      });
    }
  };

  const removeEditSize = (index) => {
    setEditForm({
      ...editForm,
      sizesArray: editForm.sizesArray.filter((_, i) => i !== index)
    });
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

  // Handle Add Product
  const handleAddProduct = async () => {
    if (!addForm.name || !addForm.price || !addForm.category_id || !addForm.image || addForm.colorsArray.length === 0 || addForm.sizesArray.length === 0) {
      toast.error("Please fill all required fields including colors and sizes");
      return;
    }

    const formData = new FormData();
    formData.append("name", addForm.name);
    formData.append("description", addForm.description);
    formData.append("price", addForm.price);
    formData.append("rating", addForm.rating || "4.0");
    formData.append("category_id", addForm.category_id);
    formData.append("image", addForm.image);
    
    // Convert arrays to comma-separated strings instead of JSON
    formData.append("available_colors", addForm.colorsArray.join(","));
    formData.append("available_sizes", addForm.sizesArray.join(","));

    // Append other images
    addForm.other_images.forEach((file, index) => {
      formData.append("other_images", file);
    });

    // Debug: Check what's in FormData
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

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
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
      setLoading(false)
    }
  };

  // Handle Edit Product
  const handleEditProduct = async () => {
    try {
      await axios.patch(`/product/edit/${selectedProduct.id}`, {
        ...editForm,
        available_colors: editForm.colorsArray.join(","),
        available_sizes: editForm.sizesArray.join(",")
      }, {
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

  // Form handlers
  const resetAddForm = () => {
    setAddForm({
      name: "",
      description: "",
      price: "",
      rating: "",
      category_id: "",
      colorInput: "",
      sizeInput: "",
      colorsArray: [],
      sizesArray: [],
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
  
  // Parse the colors and sizes from the database
  let colorsArray = [];
  let sizesArray = [];
  
  try {
    // Handle available_colors - it could be a JSON string or already parsed
    if (product.available_colors) {
      if (typeof product.available_colors === 'string') {
        // Try to parse as JSON first
        try {
          colorsArray = JSON.parse(product.available_colors);
        } catch (e) {
          // If JSON parsing fails, try comma-separated
          colorsArray = product.available_colors.split(',').map(color => color.trim()).filter(color => color);
        }
      } else if (Array.isArray(product.available_colors)) {
        // Already an array
        colorsArray = product.available_colors;
      }
    }
    
    // Handle available_sizes - same logic
    if (product.available_sizes) {
      if (typeof product.available_sizes === 'string') {
        try {
          sizesArray = JSON.parse(product.available_sizes);
        } catch (e) {
          sizesArray = product.available_sizes.split(',').map(size => size.trim()).filter(size => size);
        }
      } else if (Array.isArray(product.available_sizes)) {
        sizesArray = product.available_sizes;
      }
    }
  } catch (error) {
    console.error('Error parsing product data:', error);
    colorsArray = [];
    sizesArray = [];
  }

  setEditForm({
    name: product.name,
    description: product.description || "",
    price: product.price,
    rating: product.rating,
    category_id: product.category_id,
    colorInput: "",
    sizeInput: "",
    colorsArray: colorsArray,
    sizesArray: sizesArray
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {paginatedProducts.map(product => {
            // Safe parsing function for colors and sizes
            const parseField = (field) => {
              if (!field) return [];
              if (Array.isArray(field)) return field;
              if (typeof field === 'string') {
                try {
                  // Try to parse as JSON first
                  const parsed = JSON.parse(field);
                  return Array.isArray(parsed) ? parsed : [];
                } catch {
                  // If JSON parsing fails, try comma-separated
                  return field.split(',').map(item => item.trim()).filter(item => item);
                }
              }
              return [];
            };

            const colors = parseField(product.available_colors);
            const sizes = parseField(product.available_sizes);

            return (
              <div key={product.id} className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <div className="relative h-80 bg-muted/30 overflow-hidden">
                  <img
                    loading="lazy"
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Rating Badge - Top Right */}
                  {product.rating && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-semibold shadow-lg">
                      <span className="text-yellow-400">★</span>
                      <span>{product.rating}</span>
                    </div>
                  )}

                  {/* Category Badge - Top Left */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                    {product.category_name}
                  </div>

                  {/* Hover Overlay with Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-white text-black p-3 rounded-full hover:bg-accent transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 hover:scale-110 shadow-lg"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="bg-white text-black p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 hover:scale-110 shadow-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-2 line-clamp-1 text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-2xl text-primary">
                      {formatCurrency(parseFloat(product.price))}
                    </span>
                  </div>

                  {/* Available Colors Preview */}
                  {colors.length > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground font-medium">Colors:</span>
                      <div className="flex gap-1.5">
                        {colors.slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                            style={{
                              backgroundColor: 
                                color.toLowerCase() === "white" ? "#f8f8f8" :
                                color.toLowerCase() === "black" ? "#000000" :
                                color.toLowerCase() === "red" ? "#ff0000" :
                                color.toLowerCase() === "blue" ? "#0000ff" :
                                color.toLowerCase() === "green" ? "#00ff00" :
                                color.toLowerCase() === "cream" ? "#fffdd0" :
                                color.toLowerCase() === "beige" ? "#f5f5dc" :
                                color.toLowerCase() === "gray" ? "#808080" :
                                color.toLowerCase() === "navy" ? "#000080" :
                                color.toLowerCase() === "burgundy" ? "#800020" :
                                color.toLowerCase() === "blush" ? "#de5d83" :
                                color.toLowerCase() === "brown" ? "#8B4513" :
                                color.toLowerCase() === "purple" ? "#800080" :
                                color.toLowerCase() === "pink" ? "#FFC0CB" :
                                color.toLowerCase() === "orange" ? "#FFA500" :
                                color.toLowerCase() === "yellow" ? "#FFFF00" :
                                "#ccc"
                            }}
                            title={color}
                          />
                        ))}
                        {colors.length > 4 && (
                          <div className="w-5 h-5 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-medium text-muted-foreground shadow-md">
                            +{colors.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Available Sizes */}
                  {sizes.length > 0 && (
                    <div className="flex items-center justify-between pt-3">
                      <span className="text-sm text-muted-foreground font-medium">Sizes:</span>
                      <div className="flex gap-1">
                        {sizes.slice(0, 3).map((size, index) => (
                          <span key={index} className="text-xs bg-muted px-2 py-1 rounded-md font-medium">
                            {size}
                          </span>
                        ))}
                        {sizes.length > 3 && (
                          <span className="text-xs bg-muted px-2 py-1 rounded-md font-medium">
                            +{sizes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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

              {/* Available Colors */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Available Colors *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {addForm.colorsArray.map((color, index) => (
                    <span key={index} className="flex items-center gap-1 bg-accent/20 px-3 py-1 rounded-full text-sm">
                      {color}
                      <button 
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={addForm.colorInput}
                    onChange={(e) => setAddForm({...addForm, colorInput: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && addColor()}
                    className="flex-1 p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="Enter a color and press Enter"
                  />
                  <button 
                    type="button"
                    onClick={addColor}
                    className="px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Available Sizes */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Available Sizes *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {addForm.sizesArray.map((size, index) => (
                    <span key={index} className="flex items-center gap-1 bg-accent/20 px-3 py-1 rounded-full text-sm">
                      {size}
                      <button 
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={addForm.sizeInput}
                    onChange={(e) => setAddForm({...addForm, sizeInput: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && addSize()}
                    className="flex-1 p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="Enter a size and press Enter"
                  />
                  <button 
                    type="button"
                    onClick={addSize}
                    className="px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Add
                  </button>
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
                         loading="lazy"
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
                    setSearchTerm("");
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
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-card rounded-xl border border-accent/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows="3"
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                </div>

                {/* Available Colors */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Available Colors</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editForm.colorsArray.map((color, index) => (
                      <span key={index} className="flex items-center gap-1 bg-accent/20 px-3 py-1 rounded-full text-sm">
                        {color}
                        <button 
                          type="button"
                          onClick={() => removeEditColor(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editForm.colorInput}
                      onChange={(e) => setEditForm({...editForm, colorInput: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && addEditColor()}
                      className="flex-1 p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="Enter a color"
                    />
                    <button 
                      type="button"
                      onClick={addEditColor}
                      className="px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Available Sizes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Available Sizes</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editForm.sizesArray.map((size, index) => (
                      <span key={index} className="flex items-center gap-1 bg-accent/20 px-3 py-1 rounded-full text-sm">
                        {size}
                        <button 
                          type="button"
                          onClick={() => removeEditSize(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editForm.sizeInput}
                      onChange={(e) => setEditForm({...editForm, sizeInput: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && addEditSize()}
                      className="flex-1 p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="Enter a size"
                    />
                    <button 
                      type="button"
                      onClick={addEditSize}
                      className="px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
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