import ProductFilters from "@/components/Products/ProductFilters";
import QuickPreviewModal from "@/components/Products/QuickPreviewModal";
import { useState } from "react";
import { DEMO_PRODUCTS, CATEGORIES, CURRENCIES } from "@/demo/demo";
import ProductGrid from "@/components/Products/ProductGrid";
import ProductList from "@/components/Products/ProductsList";

function Products() {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currency, setCurrency] = useState("USD");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter products
  const filteredProducts = DEMO_PRODUCTS.filter(
    (product) =>
      selectedCategory === "All" || product.category === selectedCategory
  );

  // Sort products
  switch (sortBy) {
    case "name-asc":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  const displayedProducts = filteredProducts.slice(0, itemsPerPage);

  const handleAddToCart = (productId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-foreground">
          Our Collection
        </h1>

        {/* Filters Section */}
        <ProductFilters
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          currencies={CURRENCIES}
          selectedCurrency={currency}
          onCurrencyChange={setCurrency}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        {/* Products Display */}
        {viewMode === "grid" ? (
          <ProductGrid
            products={displayedProducts}
            currency={currency}
            onQuickPreview={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <ProductList
            products={displayedProducts}
            currency={currency}
            onQuickPreview={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>

      {/* Quick Preview Modal */}
      {selectedProduct && (
        <QuickPreviewModal
          product={selectedProduct}
          currency={currency}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </main>
  );
}

export default Products;
