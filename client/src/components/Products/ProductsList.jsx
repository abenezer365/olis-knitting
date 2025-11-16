import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ProductList({
  products,
  onAddToCart,
  currency,
  currencyRate,
  onQuickPreview,
}) {
  const [hoveredImageId, setHoveredImageId] = useState(null);

  // 🧠 Normalize product data before rendering
  const normalizedProducts = useMemo(() => {
    return products.map((product) => {
      let parsedColors = [];
      let parsedSizes = [];
      let parsedImages = [];

      try {
        parsedColors = Array.isArray(product.colors)
          ? product.colors
          : JSON.parse(product.colors || "[]");
      } catch {
        parsedColors = [];
      }

      try {
        parsedSizes = Array.isArray(product.sizes)
          ? product.sizes
          : JSON.parse(product.sizes || "[]");
      } catch {
        parsedSizes = [];
      }

      try {
        parsedImages = Array.isArray(product.other_images)
          ? product.other_images
          : JSON.parse(product.other_images || "[]");
      } catch {
        parsedImages = [];
      }

      return {
        ...product,
        colors: parsedColors,
        sizes: parsedSizes,
        images: [product.image, ...parsedImages].filter(Boolean),
      };
    });
  }, [products]);

  const formatPrice = (price) => {
    if (currency === "ETB") {
      return `${(price * currencyRate).toFixed(0)} ${currency}`;
    }
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const handleAddToCart = (arg1, arg2) => {
    const product = arg2 ?? arg1;
    if (!product) return;
    onAddToCart(product);
  };

  const handleQuickPreview = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickPreview(product);
  };

  const getColorCode = (color) => {
    const map = {
      white: "#f8f8f8",
      black: "#000000",
      red: "#ff0000",
      blue: "#0000ff",
      green: "#00ff00",
      cream: "#fffdd0",
      beige: "#f5f5dc",
      gray: "#808080",
      navy: "#000080",
      burgundy: "#800020",
      blush: "#de5d83",
      brown: "#8B4513",
      purple: "#800080",
      pink: "#FFC0CB",
      orange: "#FFA500",
      yellow: "#FFFF00",
    };
    return map[color.toLowerCase()] || "#ccc";
  };

  return (
    <div className="space-y-4">
      {normalizedProducts.map((product) => {
        const mainImage = product.images[0] || "/placeholder.svg";

        return (
          <div
            key={product.id}
            className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4"
          >
            {/* Product Image */}
            <div
              className="relative w-full h-48 md:w-48 md:h-48 bg-secondary rounded-lg overflow-hidden shrink-0"
              onMouseEnter={() => setHoveredImageId(product.id)}
              onMouseLeave={() => setHoveredImageId(null)}
            >
              <Link to={`/products/${product.id}`} className="block h-full">
                <img
                  loading="lazy"
                  src={`${mainImage}?f=auto&q=auto`}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {hoveredImageId === product.id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-all duration-300">
                  <TooltipProvider>
                    {/* Quick Preview */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => handleQuickPreview(e, product)}
                          className="bg-white text-black p-3 rounded-full hover:bg-accent transition-colors duration-200 transform hover:scale-110"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Quick Preview</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Add to Cart */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="bg-white text-black p-3 rounded-full hover:bg-accent transition-colors duration-200 transform hover:scale-110"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to Cart</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {/* Rating Badge */}
              {product.rating && (
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="text-sm font-medium text-foreground">★</span>
                  <span className="text-sm font-medium text-foreground">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <Link
                to={`/products/${product.id}`}
                className="flex flex-col h-full"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors mb-2">
                    {product.name}
                  </h3>

                  {/* Category */}
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.category}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <p className="text-xl font-bold text-primary mb-2">
                    {formatPrice(parseFloat(product.price))}
                  </p>

                  {/* Colors and Sizes */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {product.colors.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span>Colors:</span>
                        <div className="flex gap-1">
                          {product.colors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: getColorCode(color) }}
                              title={color}
                            />
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {product.sizes.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span>Sizes:</span>
                        <span>
                          {product.sizes
                            .map((size) => size.toUpperCase())
                            .slice(0, 3)
                            .join(", ")}
                        </span>
                        {product.sizes.length > 3 && (
                          <span className="text-xs">
                            +{product.sizes.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>

              {/* Add to Cart Button (mobile) */}
              <div className="mt-4 md:hidden">
                <Button
                  onClick={() => handleAddToCart(product)}
                  size="sm"
                  className="gap-2 w-full"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Add to Cart Button (desktop) */}
            <div className="hidden md:flex items-end">
              <Button
                onClick={() => handleAddToCart(product)}
                size="sm"
                className="gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;
