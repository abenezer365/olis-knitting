import { useState, useMemo } from "react";
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

  // 🧠 Normalize products data before rendering
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

  console.log("Products:", products);
  console.log("Normalized Products:", normalizedProducts);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {normalizedProducts.map((product) => {
        const mainImage = product.images?.[0] || "/placeholder.svg";
        const colorsArray = product.colors || [];

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
                  loading="lazy"
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Hover Overlay with Actions */}
              {hoveredImageId === product.id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-all duration-300">
                  <TooltipProvider>
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

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(parseFloat(product.price))}
                  </p>

                  {/* Colors Preview */}
                  {colorsArray.length > 0 && (
                    <div className="flex gap-1">
                      {colorsArray.slice(0, 3).map((color, index) => (
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
                                : color.toLowerCase() === "brown"
                                ? "#8B4513"
                                : color.toLowerCase() === "purple"
                                ? "#800080"
                                : color.toLowerCase() === "pink"
                                ? "#FFC0CB"
                                : color.toLowerCase() === "orange"
                                ? "#FFA500"
                                : color.toLowerCase() === "yellow"
                                ? "#FFFF00"
                                : "#ccc",
                          }}
                          title={color}
                        />
                      ))}

                      {colorsArray.length > 3 && (
                        <div className="w-3 h-3 rounded-full bg-muted flex items-center justify-center text-xs">
                          +{colorsArray.length - 3}
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
