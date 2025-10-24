import React from "react";
import { Link } from "react-router-dom";

export default function RelatedProducts({ products, onProductClick }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-border pt-12">
      <h2 className="text-3xl font-bold text-foreground mb-8">
        Related Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 h-80">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            onClick={() => onProductClick(product.id)}
            className="group relative overflow-hidden rounded-lg border border-border hover:shadow-lg transition-shadow cursor-pointer block"
          >
            <div className="relative h-60 bg-secondary overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-3 text-center">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                ${product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
