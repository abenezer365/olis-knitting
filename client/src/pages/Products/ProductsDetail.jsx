import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProductImageZoom from "@/components/Products/ProductImageZoom";
import { DEMO_PRODUCTS } from "@/demo/demo";
import RelatedProducts from "@/components/Products/RelatedProducts";
import { useGlobalContext } from "@/contexts/Context";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

function ProductsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, clearCart } = useGlobalContext();

  const productId = parseInt(id);
  const [currentProduct, setCurrentProduct] = useState(
    DEMO_PRODUCTS.find((p) => p.id === productId)
  );

  const [selectedColor, setSelectedColor] = useState(
    currentProduct?.colors?.[0] || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    currentProduct?.sizes?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (product) => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
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
    navigate("/order");
  };

  if (!currentProduct) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </main>
    );
  }

  const others = DEMO_PRODUCTS.filter((p) => p.id !== currentProduct.id);
  const sameCategory = others
    .filter((p) => p.category === currentProduct.category)
    .slice(0, 4);
  const relatedProducts = sameCategory.length
    ? sameCategory
    : others.slice(0, 4);

  const handleRelatedProductClick = (productId) => {
    const newProduct = DEMO_PRODUCTS.find((p) => p.id === productId);
    if (newProduct) {
      setCurrentProduct(newProduct);
      setSelectedColor(newProduct.colors?.[0] || "");
      setSelectedSize(newProduct.sizes?.[0] || "");
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
                ${currentProduct.price}
              </p>
              <p className="text-muted-foreground mt-2">
                ★ {currentProduct.rating} Rating
              </p>
            </div>

            <p className="text-foreground leading-relaxed">
              {currentProduct.description}
            </p>

            {/* Color Selection */}
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

            {/* Size Selection */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-3">
                Available Sizes
              </label>
              <div className="flex gap-3 flex-wrap">
                {currentProduct.sizes.map((size) => (
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
              <Button
                onClick={() => handleAddToCart(currentProduct)}
                className="w-full"
                size="lg"
              >
                Add to Cart
              </Button>

              <Button
                onClick={handleBuyNow}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                Buy Now
              </Button>

              {/* Contact Buttons */}
              <div className="flex gap-3 mt-8">
                <a
                  href="https://wa.me/251911234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <FaWhatsapp size={22} />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href="https://t.me/olifashion"
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
