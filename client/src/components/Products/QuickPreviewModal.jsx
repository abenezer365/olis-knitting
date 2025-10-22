import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

function QuickPreviewModal({ product, currency, onClose }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

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
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    onClose();
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
            className="relative lg:h-150 xs:h-96 bg-secondary rounded-lg overflow-hidden cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className={`object-cover w-full h-full transition-transform duration-200 ${
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
              className="w-full gap-2 mt-4"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>

            {/* Contact Buttons */}
            <div className="flex gap-2 pt-2">
              <a
                href="https://wa.me/251911234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
              <a
                href="https://t.me/olifashion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <MessageCircle size={20} />
                Telegram
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuickPreviewModal;
