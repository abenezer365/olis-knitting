import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ProductGrid({
  products,
  onAddToCart,
  currency,
  currencyRate,
  onQuickPreview,
}) {
  const [hoveredImageId, setHoveredImageId] = useState(null);

  const formatPrice = (price) => {
    if (currency === "ETB") {
      return `${(price * currencyRate).toFixed(0)} ${currency}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleQuickPreview = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickPreview(product);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const productImages = product.images || [product.image].filter(Boolean);
        const mainImage = productImages[0] || "/placeholder.svg";

        return (
          <div
            key={product.id}
            className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300"
          >
            {/* Product Image */}
            <div
              className="relative h-70 bg-secondary overflow-hidden"
              onMouseEnter={() => setHoveredImageId(product.id)}
              onMouseLeave={() => setHoveredImageId(null)}
            >
              <Link to={`/products/${product.id}`} className="block h-full">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Hover Overlay with Actions */}
              {hoveredImageId === product.id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-all duration-300">
                  <TooltipProvider>
                    {/* Quick Preview Button */}
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

                    {/* Add to Cart Button */}
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
            <Link to={`/products/${product.id}`}>
              <div className="px-4 py-2 cursor-pointer">
                <h3 className="font-semibold text-foreground truncate mb-1 text-lg">
                  {product.name}
                </h3>

                {/* Category */}
                {/* <p className="text-sm text-muted-foreground mb-2">
                  {product.category}
                </p> */}

                {/* Description (truncated) */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>

                  {/* Colors Preview */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{
                            backgroundColor:
                              color.toLowerCase() === "white"
                                ? "#f8f8f8"
                                : color.toLowerCase() === "black"
                                ? "#000000"
                                : color.toLowerCase() === "red"
                                ? "#ff0000"
                                : color.toLowerCase() === "blue"
                                ? "#0000ff"
                                : color.toLowerCase() === "green"
                                ? "#00ff00"
                                : color.toLowerCase() === "cream"
                                ? "#fffdd0"
                                : color.toLowerCase() === "beige"
                                ? "#f5f5dc"
                                : color.toLowerCase() === "gray"
                                ? "#808080"
                                : color.toLowerCase() === "navy"
                                ? "#000080"
                                : color.toLowerCase() === "burgundy"
                                ? "#800020"
                                : color.toLowerCase() === "blush"
                                ? "#de5d83"
                                : "#ccc",
                          }}
                          title={color}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <div className="w-3 h-3 rounded-full bg-muted flex items-center justify-center text-xs">
                          +{product.colors.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default ProductGrid;
