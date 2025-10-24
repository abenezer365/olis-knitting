import React, { useState } from 'react';
import CSS from './Products.module.css';

const Products = () => {
  const [products, ] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 129.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      category: 'Electronics',
      stock: 45,
      description: 'High-quality wireless headphones with noise cancellation'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 199.99,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      category: 'Electronics',
      stock: 23,
      description: 'Advanced fitness tracking with heart rate monitor'
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      price: 29.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      category: 'Clothing',
      stock: 89,
      description: 'Comfortable organic cotton t-shirt in various colors'
    },
    {
      id: 4,
      name: 'Professional Camera',
      price: 899.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
      category: 'Electronics',
      stock: 12,
      description: 'Professional DSLR camera for photography enthusiasts'
    },
    {
      id: 5,
      name: 'Stainless Steel Water Bottle',
      price: 24.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop',
      category: 'Home',
      stock: 156,
      description: 'Insulated stainless steel bottle keeps drinks hot/cold'
    },
    {
      id: 6,
      name: 'Gaming Mechanical Keyboard',
      price: 149.99,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
      category: 'Electronics',
      stock: 34,
      description: 'RGB mechanical keyboard with customizable keys'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stock':
          return b.stock - a.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const handleEdit = (productId) => {
    console.log('Edit product:', productId);
    // Edit functionality will be implemented later
  };

  const handleDelete = (productId) => {
    console.log('Delete product:', productId);
    // Delete functionality will be implemented later
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className={CSS.container}>
      <div className={CSS.header}>
        <h1>Product Management</h1>
        <p>Manage your product inventory</p>
      </div>

      <div className={CSS.controls}>
        <div className={CSS.searchBox}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={CSS.search}
          />
        </div>
        
        <div className={CSS.filters}>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={CSS.filter}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={CSS.filter}
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="stock">Stock Level</option>
          </select>
        </div>
      </div>

      <div className={CSS.productsGrid}>
        {filteredProducts.map(product => (
          <div key={product.id} className={CSS.productCard}>
            <div className={CSS.imageContainer}>
              <img src={product.image} alt={product.name} className={CSS.productImage} />
              <div className={CSS.categoryTag}>{product.category}</div>
            </div>
            
            <div className={CSS.productInfo}>
              <h3 className={CSS.productName}>{product.name}</h3>
              <p className={CSS.productDescription}>{product.description}</p>
              
              <div className={CSS.rating}>
                <span className={CSS.stars}>{renderStars(product.rating)}</span>
                <span className={CSS.ratingValue}>({product.rating})</span>
              </div>
              
              <div className={CSS.details}>
                <div className={CSS.price}>${product.price}</div>
                <div className={CSS.stock}>
                  <span className={product.stock > 20 ? CSS.inStock : CSS.lowStock}>
                    {product.stock} in stock
                  </span>
                </div>
              </div>
            </div>

            <div className={CSS.actions}>
              <button 
                className={CSS.editBtn}
                onClick={() => handleEdit(product.id)}
              >
                Edit
              </button>
              <button 
                className={CSS.deleteBtn}
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className={CSS.noResults}>
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Products;