import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

function QuickPreviewModal({ product, onAddToCart, currency, onClose }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!zoom) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  const formatPrice = (price) => {
    if (currency === "ETB") {
      return `${(price * 50).toFixed(0)} ${currency}`;
    }
    return `$${price}`;
  };

  const handleAddToCart = (product) => {
    const payload = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || product.images?.[0],
      rating: product.rating,
      quantity,
      color: selectedColor,
      size: selectedSize,
    };
    onAddToCart(payload);
    // close the quick preview modal after adding to cart
    if (typeof onClose === "function") onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image with Zoom */}
          <div
            className="relative bg-secondary rounded-lg overflow-hidden cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className={`object-contain w-full h-full transition-transform duration-200 ${
                zoom ? "scale-150" : "scale-100"
              }`}
              style={
                zoom
                  ? {
                      transformOrigin: `${position.x}% ${position.y}%`,
                    }
                  : {}
              }
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4 overflow-y-auto max-h-150">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            <p className="text-muted-foreground text-sm">
              {product.description}
            </p>

            {/* Color Selection */}
            <div>
              <label className="text-sm font-semibold text-foreground">
                Color
              </label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 text-sm rounded-lg border-2 transition-all ${
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
              <label className="text-sm font-semibold text-foreground">
                Size
              </label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 text-sm rounded-lg border-2 transition-all ${
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
              <label className="text-sm font-semibold text-foreground">
                Quantity
              </label>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-secondary text-sm"
                >
                  −
                </button>
                <span className="px-4 py-2 text-center min-w-12 text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-secondary text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={() => handleAddToCart(product)}
              className="w-full gap-2 mt-4 py-6"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>

            {/* Contact Buttons */}
            <div className="flex gap-2 pt-2">
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/251911234567"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                <FaWhatsapp
                  size={22}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="relative">
                  WhatsApp
                  {/* Animated underline */}
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </span>
              </a>

              {/* Telegram Button */}
              <a
                href="https://t.me/olifashion"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-linear-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                <FaTelegramPlane
                  size={22}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="relative">
                  Telegram
                  {/* Animated underline */}
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuickPreviewModal;
