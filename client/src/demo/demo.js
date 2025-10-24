import A1 from "../assets/1.webp";
import A2 from "../assets/2.webp";
import A3 from "../assets/3.webp";
import A4 from "../assets/4.webp";
import A5 from "../assets/5.webp";
import A6 from "../assets/6.webp";
import A7 from "../assets/7.webp";
import A8 from "../assets/8.webp";
import A9 from "../assets/9.webp";
import B1 from "../assets/1a.webp";
import B2 from "../assets/2a.webp";
import B3 from "../assets/3a.webp";
import B4 from "../assets/4a.webp";
import B5 from "../assets/5a.webp";
import B6 from "../assets/6a.webp";
import B7 from "../assets/7a.webp";
import B8 from "../assets/8a.webp";
import B9 from "../assets/9a.webp";

export const images = [
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
  A8,
  A9,
  B1,
  B2,
  B3,
  B4,
  B5,
  B6,
  B7,
  B8,
  B9,
];

// Demo products data
export const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Premium Merino Sweater",
    price: 189,
    image: A1,
    category: "Sweaters",
    rating: 4.8,
    description:
      "Luxurious merino wool sweater with perfect fit and breathable fabric",
    colors: ["Black", "Cream", "Beige"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [A1, A9, B1],
  },
  {
    id: 2,
    name: "Cashmere Blend Cardigan",
    price: 249,
    image: A2,
    category: "Cardigans",
    rating: 4.9,
    description: "Soft cashmere blend cardigan for elegance and comfort",
    colors: ["Beige", "Gray", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [A2, B2, B3],
  },
  {
    id: 3,
    name: "Wool Knit Dress",
    price: 299,
    image: A3,
    category: "Dresses",
    rating: 4.7,
    description: "Elegant wool knit dress for any occasion",
    colors: ["Black", "Burgundy", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [A3, B4, B5],
  },
  {
    id: 4,
    name: "Cotton Blend Shirt",
    price: 129,
    image: A4,
    category: "Shirts",
    rating: 4.6,
    description: "Comfortable cotton blend shirt",
    colors: ["White", "Blue", "Cream"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [A4, B6, B7],
  },
  {
    id: 5,
    name: "Silk Blend Blouse",
    price: 179,
    image: A5,
    category: "Blouses",
    rating: 4.8,
    description: "Sophisticated silk blend blouse",
    colors: ["Cream", "Black", "Blush"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [A5, B8, B9],
  },
  {
    id: 6,
    name: "Wool Trousers",
    price: 159,
    image: A6,
    category: "Trousers",
    rating: 4.7,
    description: "Premium wool trousers with perfect drape",
    colors: ["Black", "Gray", "Beige"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [A6, A1, A2],
  },
  {
    id: 7,
    name: "Linen Jacket",
    price: 219,
    image: A7,
    category: "Jackets",
    rating: 4.9,
    description: "Breathable linen jacket for summer",
    colors: ["Cream", "Beige", "White"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [A7, B1, B2],
  },
  {
    id: 8,
    name: "Knit Scarf",
    price: 89,
    image: A8,
    category: "Accessories",
    rating: 4.8,
    description: "Cozy knit scarf for all seasons",
    colors: ["Cream", "Gray", "Black"],
    sizes: ["One Size"],
    images: [A8, A9, B9],
  },
];

export const CATEGORIES = [
  "All",
  "Sweaters",
  "Cardigans",
  "Dresses",
  "Shirts",
  "Blouses",
  "Trousers",
  "Jackets",
  "Accessories",
];

export const CURRENCIES = ["USD", "ETB"];
