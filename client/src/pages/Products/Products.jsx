// components/Products/Products.js
import { useState, useEffect } from "react";
import ProductFilters from "@/components/Products/ProductFilters";
import QuickPreviewModal from "@/components/Products/QuickPreviewModal";

import { useGlobalContext } from "@/contexts/Context";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductGrid from "@/components/Products/ProductGrid";
import ProductList from "@/components/Products/ProductsList";

function Products() {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currency, setCurrency] = useState("USD");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const { addToCart } = useGlobalContext();
  const { products, categories, currencyRate, loading, error } = useProducts();

  // Transform API data to match component expectations
  const transformProduct = (product) => ({
    id: product.id,
    uuid: product.uuid,
    name: product.name,
    price: parseFloat(product.price),
    image: product.image,
    category: product.category_name,
    rating: product.rating ? parseFloat(product.rating) : 4.0,
    description: product.description,
    colors: product.available_colors || [],
    sizes: product.available_sizes || [],
    images: [product.image, ...(product.other_images || [])],
  });

  const transformedProducts = products.map(transformProduct);

  // Filter products
  const filteredProducts = transformedProducts.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;
    const priceMatch =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, priceRange, itemsPerPage]);

  const handleAddToCart = (product) => {
    if (!product) return;

    if (product.color || product.size || product.quantity) {
      addToCart(product);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      rating: product.rating,
      quantity: 1,
      color: product.colors?.[0] || null,
      size: product.sizes?.[0] || null,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-foreground">
          Our Collection
        </h1>

        {/* Filters Section */}
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          currencies={["USD", "ETB"]}
          selectedCurrency={currency}
          onCurrencyChange={setCurrency}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          totalProducts={filteredProducts.length}
        />

        {/* Products Display */}
        {viewMode === "grid" ? (
          <ProductGrid
            products={displayedProducts}
            currency={currency}
            currencyRate={currencyRate}
            onQuickPreview={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <ProductList
            products={displayedProducts}
            currency={currency}
            currencyRate={currencyRate}
            onQuickPreview={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Quick Preview Modal */}
      {selectedProduct && (
        <QuickPreviewModal
          product={selectedProduct}
          currency={currency}
          currencyRate={currencyRate}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </main>
  );
}

export default Products;
