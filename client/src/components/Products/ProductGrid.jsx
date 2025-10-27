import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Tooltip,  TooltipContent,  TooltipProvider,  TooltipTrigger,} from "@/components/ui/tooltip";


function ProductGrid({ products, onAddToCart ,currency, onQuickPreview }) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
        >
          {/* Product Image */}
          <div
            className="relative h-85 bg-secondary overflow-hidden"
            onMouseEnter={() => setHoveredImageId(product.id)}
            onMouseLeave={() => setHoveredImageId(null)}
          >
            <Link to={`/products/${product.id}`}>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {hoveredImageId === product.id && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-all">
                <TooltipProvider>
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

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => handleAddToCart(e,product)}
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

          {/* Product Info */}
          <Link to={`/products/${product.id}`}>
            <div className="p-4 cursor-pointer">
              <h3 className="font-semibold text-foreground truncate">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  ★ {product.rating}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
