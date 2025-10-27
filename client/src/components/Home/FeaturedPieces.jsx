import React from "react";
import ParallaxScrollDemo from "../Home/ParallaxScrollDemo";
import { Link } from "react-router-dom";

function FeaturedPieces() {
  return (
    <section className="pt-20 pb-10 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-15">
          <h2 className="text-4xl md:text-5xl font-bungee text-foreground mb-4">
            Gallery
          </h2>
          <p className="text-muted-foreground text-lg">
            Handpicked selections from our latest collection
          </p>
        </div>
      </div>
      <div>
        <ParallaxScrollDemo />
      </div>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <Link
            to="/products"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedPieces;
