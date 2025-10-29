import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { images } from "@/demo/demo";

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
