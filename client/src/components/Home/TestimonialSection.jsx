import React from "react";
import { AnimatedTestimonials } from "../ui/animated-testimonials";
import testimonial_1 from "../../assets/testimonial-1.jpg";
import testimonial_2 from "../../assets/testimonial-2.png";
import testimonial_3 from "../../assets/testimonial-3.png";
import testimonial_4 from "../../assets/testimonial-4.png";
import testimonial_5 from "../../assets/testimonial-5.png";

function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "Love Oli’s! Each piece is unique, beautifully made, and so versatile—I get compliments every time I wear them!",
      name: "Nicole Rock",
      designation: "Customer",
      src: testimonial_1,
    },
    {
      quote:
        "I’m obsessed! Oli’s designs are elegant, cozy, and timeless. Truly handmade perfection.",
      name: "Meti Tile",
      designation: "Fashion Enthusiast",
      src: testimonial_2,
    },
    {
      quote:
        "Oli made our family matching outfits that we’ll treasure forever warm, beautiful, and full of love!",
      name: "Miki Family",
      designation: "Happy Knitwear Family",
      src: testimonial_3,
    },
    {
      quote:
        "Oli’s knitwear hits all the right notes — stylish, soulful, and made with passion.Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "Robel Bzuayehu",
      designation: "Musician & Knitwear Admirer",
      src: testimonial_4,
    },
    {
      quote:
        "Oli’s designs are made to shine — every outfit tells a story of beauty and creativity.",
      name: "Miss Leyu",
      designation: "TikToker & Fashion Influencer",
      src: testimonial_5,
    },
  ];
  return (
    <section className="pt-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Client Stories
          </p>
          <h2 className=" text-4xl md:text-5xl font-bungee text-foreground">
            Loved by Our Clients
          </h2>
        </div>
      </div>
      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  );
}
export default TestimonialSection;
