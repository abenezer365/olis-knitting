import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { DEMO_PRODUCTS } from "@/demo/demo";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuickPreviewModal from "@/components/Products/QuickPreviewModal";
import { useGlobalContext } from "@/contexts/Context";

function FeaturedProducts() {
  const featuredProducts = DEMO_PRODUCTS.slice(0, 4); // choose how many to show
  const [hoveredId, setHoveredId] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  const { addToCart } = useGlobalContext();

  const handleAddToCart = (product) => {
    if (!product) return;
    // If caller provided a full payload (from QuickPreviewModal) keep it as-is
    if (product.color || product.size || product.quantity) {
      addToCart(product);
      return;
    }

    // otherwise build a payload with default color/size
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.images?.[0] || product.image,
      rating: product.rating,
      quantity: 1,
      color: product.colors?.[0] || null,
      size: product.sizes?.[0] || null,
    });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bungee mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked selections from our latest collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card className="hover-lift overflow-hidden pt-0">
                <div className="relative image-zoom aspect-square">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {hoveredId === product.id && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setPreviewProduct(product)}
                              className="bg-white text-black p-3 rounded-full hover:bg-accent transition-colors"
                              aria-label="Quick preview"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Quick Preview</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-white text-black p-3 rounded-full hover:bg-accent transition-colors"
                              aria-label="Add to cart"
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

                <CardContent className="p-4 py-0">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold">
                      ${product.price}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      {product.rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="Transparent" size="lg" asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </div>

      {previewProduct && (
        <QuickPreviewModal
          product={previewProduct}
          onAddToCart={(payload) => {
            handleAddToCart(payload);
            setPreviewProduct(null);
          }}
          currency={"USD"}
          onClose={() => setPreviewProduct(null)}
        />
      )}
    </section>
  );
}

export default FeaturedProducts;
