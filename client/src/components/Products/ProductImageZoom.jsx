import { useState, useEffect } from "react";

function ProductImageZoom({ images }) {
  const [mainImage, setMainImage] = useState(images?.[0]);
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Reset main image and zoom when images prop changes (e.g., when selecting a related product)
  useEffect(() => {
    setMainImage(images?.[0]);
    setZoom(false);
    setPosition({ x: 0, y: 0 });
  }, [images]);

  const handleMouseMove = (e) => {
    if (!zoom) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative lg:h-150 h-96 bg-secondary rounded-lg overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={mainImage || "/placeholder.svg"}
          alt="Product"
          className={`object-contain w-full h-full transition-transform duration-200 ${
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

      {/* Thumbnail Images */}
      <div className="flex gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setMainImage(image)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              mainImage === image
                ? "border-primary"
                : "border-border hover:border-primary"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Product ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductImageZoom;
