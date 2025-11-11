import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Eye, ShoppingCart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuickPreviewModal from "@/components/Products/QuickPreviewModal";
import { useGlobalContext } from "@/contexts/Context";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/utils/axios.instance";

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  const { addToCart } = useGlobalContext();

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/product/getProducts");

        if (response.data.success) {
          // Transform API data and take first 4 products as featured
          const products = response.data.products
            .slice(0, 4)
            .map((product) => ({
              id: product.id,
              uuid: product.uuid,
              name: product.name,
              price: parseFloat(product.price),
              image: product.image,
              category: product.category_name,
              rating: product.rating ? parseFloat(product.rating) : 4.0,
              description: product.description,
              colors: product.available_colors || [],
              sizes: product.available_sizes || [],
              images: [product.image, ...(product.other_images || [])].filter(
                Boolean
              ),
            }));

          setFeaturedProducts(products);
        }
      } catch (err) {
        setError("Failed to load featured products");
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!product) return;

    if (product.color || product.size || product.quantity) {
      addToCart(product);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      rating: product.rating,
      quantity: 1,
      color: product.colors?.[0] || null,
      size: product.sizes?.[0] || null,
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-20 bg-linear-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="group relative">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <div className="flex items-center justify-between mt-4">
                      <Skeleton className="h-7 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-linear-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Premium Collection
          </div>
          <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium fashion pieces,
            carefully curated for style and quality
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 ">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative "
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm group-hover:scale-105 group-hover:rotate-1 transform-gpu p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden aspect-square">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>

                  {/* Hover Overlay with Actions */}
                  {hoveredId === product.id && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-4 transition-all duration-300">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setPreviewProduct(product)}
                              className="bg-white text-black p-4 rounded-full hover:bg-accent hover:scale-110 transition-all duration-300 shadow-lg transform-gpu"
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
                              className="bg-white text-black p-4 rounded-full hover:bg-accent hover:scale-110 transition-all duration-300 shadow-lg transform-gpu"
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

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {product.category}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  {product.rating && (
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {product.rating}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <CardContent className="px-6 py-3 pt-0">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="hover:underline decoration-2 underline-offset-4"
                    >
                      {product.name}
                    </Link>
                  </h3>

                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Color Dots Preview */}
                    {product.colors.length > 0 && (
                      <div className="flex gap-1">
                        {product.colors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
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
                          <div className="w-3 h-3 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                            +{product.colors.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            asChild
          >
            <Link to="/products" className="flex items-center gap-2">
              <span>Explore All Products</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Preview Modal */}
      {previewProduct && (
        <QuickPreviewModal
          product={previewProduct}
          onAddToCart={(payload) => {
            handleAddToCart(payload);
            setPreviewProduct(null);
          }}
          currency={"USD"}
          currencyRate={167} // You can fetch this dynamically if needed
          onClose={() => setPreviewProduct(null)}
        />
      )}
    </section>
  );
}

export default FeaturedProducts;