import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger,} from "@/components/ui/tooltip";

function ProductList({ products, onAddToCart, currency, onQuickPreview }) {
  const [hoveredImageId, setHoveredImageId] = useState(null);

  const formatPrice = (price) => {
    if (currency === "ETB") {
      return `${(price * 50).toFixed(0)} ${currency}`;
    }
    return `$${price}`;
  };

const handleAddToCart = (e, product) => {
  onAddToCart(
    e,
    product.id,
    product.name,
    product.price,
    product.category,
    product.image,
    product.rating
  );
};


  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="grid grid-cols-[auto_1fr]  md:grid-cols-[auto_1fr_auto] gap-4 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow p-4 "
        >
          {/* Product Image - hover shows Quick Preview + Add to Cart */}
          <div
            className="relative w-32 h-32 sm:w-48 sm:h-48 bg-secondary rounded-lg overflow-hidden shrink-0"
            onMouseEnter={() => setHoveredImageId(product.id)}
            onMouseLeave={() => setHoveredImageId(null)}
          >
            <Link to={`/products/${product.id}`}>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {hoveredImageId === product.id && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-all">
                <TooltipProvider>
                  {/* Quick Preview */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onQuickPreview(product)}
                        className="bg-white text-black p-3 rounded-full hover:bg-accent transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Quick Preview</TooltipContent>
                  </Tooltip>

                  {/* Add to Cart */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-white text-black p-3 rounded-full hover:bg-accent transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Add to Cart</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>

          {/* Right Column: Info + (mobile) Add to Cart */}
          <div className="flex flex-col justify-between">
            <Link to={`/products/${product.id}`} className="flex flex-col">
              <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
                {product.name}
              </h3>

              {/* Hide description on small screens */}
              <p className="hidden sm:block text-sm text-muted-foreground mt-2">
                {product.description}
              </p>

              <p className="text-lg font-bold text-primary mt-2">
                {formatPrice(product.price)}
              </p>
            </Link>

            {/* Add to Cart Button (mobile) */}
            <div className="mt-3 md:hidden">
              <Button
                onClick={(e) => handleAddToCart(e, product)}
                size="sm"
                className="gap-2 w-full sm:w-auto"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Add to Cart Button (extra action area on large screens) */}
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
      ))}
    </div>
  );
}

export default ProductList;
