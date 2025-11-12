import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProductImageZoom from "@/components/Products/ProductImageZoom";
import RelatedProducts from "@/components/Products/RelatedProducts";
import { useGlobalContext } from "@/contexts/Context";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import axiosInstance from "@/utils/axios.instance";

function ProductsDetail() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, clearCart } = useGlobalContext();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/product/getProducts");

        if (response.data.success) {
          const products = response.data.products;
          const product = products.find((p) => p.id === parseInt(id));

          if (product) {
            const transformedProduct = transformProduct(product);
            setCurrentProduct(transformedProduct);
            setSelectedColor(transformedProduct.colors?.[0] || "");
            setSelectedSize(transformedProduct.sizes?.[0] || "");

            // Get related products
            const related = getRelatedProducts(products, transformedProduct);
            setRelatedProducts(related);
          } else {
            setError("Product not found");
          }
        }
      } catch (err) {
        setError("Failed to fetch product details");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const transformProduct = (product) => ({
    id: product.id,
    uuid: product.uuid,
    name: product.name,
    price: parseFloat(product.price),
    image: product.image,
    category: product.category_name,
    rating: product.rating ? parseFloat(product.rating) : 4.0,
    description: product.description,
    colors: parseJsonField(product.available_colors) || [],
    sizes: parseJsonField(product.available_sizes) || [],
    images: [
      product.image,
      ...(parseJsonField(product.other_images) || []),
    ].filter(Boolean),
  });

  // Helper function to parse JSON strings safely
  const parseJsonField = (field) => {
    if (!field) return null;

    try {
      // If it's already an array, return it
      if (Array.isArray(field)) return field;

      // If it's a string, try to parse it
      if (typeof field === "string") {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : null;
      }

      return null;
    } catch (error) {
      console.error("Error parsing JSON field:", error);
      return null;
    }
  };

  const getRelatedProducts = (allProducts, currentProduct) => {
    const others = allProducts.filter((p) => p.id !== currentProduct.id);
    const sameCategory = others
      .filter((p) => p.category_name === currentProduct.category)
      .slice(0, 4)
      .map(transformProduct);

    return sameCategory.length > 0
      ? sameCategory
      : others.slice(0, 4).map(transformProduct);
  };

  const handleAddToCart = () => {
    if (!currentProduct) return;

    addToCart({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const handleBuyNow = () => {
    if (!currentProduct) return;

    // clear the cart then add the product with the chosen quantity
    clearCart();

    addToCart({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });

    // redirect to order page
    navigate("/place_order");
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/products/${productId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !currentProduct) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">{error || "Product not found"}</h1>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mt-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Left: Image Zoom */}
          <ProductImageZoom images={currentProduct.images} />

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {currentProduct.name}
              </h1>
              <p className="text-xl font-bold text-primary mt-2">
                ${currentProduct.price.toFixed(2)}
              </p>
              <p className="text-muted-foreground mt-2">
                ★ {currentProduct.rating} Rating
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Category: {currentProduct.category}
              </p>
            </div>

            <p className="text-foreground leading-relaxed">
              {currentProduct.description}
            </p>

            {/* Color Selection */}
            {currentProduct.colors.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-foreground block mb-3">
                  Available Colors
                </label>
                <div className="flex gap-3 flex-wrap">
                  {currentProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {currentProduct.sizes.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-foreground block mb-3">
                  Available Sizes
                </label>
                <div className="flex gap-3 flex-wrap">
                  {currentProduct.sizes
                    .map((size) => size.toUpperCase())
                    .map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 text-center min-w-16 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button onClick={handleAddToCart} className="w-full" size="lg">
                Add to Cart
              </Button>

              <Button
                onClick={handleBuyNow}
                variant="luxury"
                className="w-full"
                size="lg"
              >
                Buy Now
              </Button>

              {/* Contact Buttons */}
              <div className="flex gap-3 mt-8">
                <a
                  href="https://wa.me/251912273435"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <FaWhatsapp size={22} />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href="https://t.me/Olisknitting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-linear-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <FaTelegramPlane size={22} />
                  <span>Chat on Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          products={relatedProducts}
          onProductClick={handleRelatedProductClick}
        />
      </div>
    </main>
  );
}

export default ProductsDetail;
