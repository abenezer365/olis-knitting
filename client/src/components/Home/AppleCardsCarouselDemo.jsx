import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

import A1 from "../../assets/gal-4.jpg";
import A2 from "../../assets/gal-5.jpg";
import A3 from "../../assets/3.webp";
import B1 from "../../assets/gal-6.jpg";
import A5 from "../../assets/2.webp";
import A6 from "../../assets/8.webp";
import A7 from "../../assets/gal-1.jpg";
import A8 from "../../assets/4.webp";
import A9 from "../../assets/9.webp";

import A4 from "../../assets/1a.webp";
import B2 from "../../assets/7.webp";

import B3 from "../../assets/3a.webp";

import B4 from "../../assets/gal-2.jpg";
import B5 from "../../assets/gal-3.jpg";
import B6 from "../../assets/gal-7.jpg";

// import B4 from "../../assets/4a.webp";
// import B5 from "../../assets/5a.webp";
// import B6 from "../../assets/6a.webp";
import B7 from "../../assets/7a.webp";
import B8 from "../../assets/8a.webp";
import B9 from "../../assets/9a.webp";

const images = [
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

export default function AppleCardsCarouselDemo() {
  const cards = images.map((src, i) => (
    <Card key={src} card={{ src }} index={i} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-6xl text-muted-foreground font-bold">
        Gallery
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
