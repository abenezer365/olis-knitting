import React from "react";
import { AnimatedTestimonials } from "../ui/animated-testimonials";
import testimonial_1 from "../../assets/testimonial-1.jpg";
import testimonial_2 from "../../assets/testimonial-2.jpg";
import testimonial_3 from "../../assets/testimonial-3.jpg";
import testimonial_4 from "../../assets/testimonial-4.jpg";
import testimonial_5 from "../../assets/testimonial-5.jpg";

function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "Absolutely love Oli’s products and recommend them to all my friends! I’ve bought three pieces and each has been so unique and beautifully crafted. You can tell attention to detail went into each piece and I really appreciate the custom color and size options. Every time I wear Oli’s to work I get tons of compliments and even more when I explain how many different ways it can be worn - genius design work!",
      name: "Nicole Rock",
      designation: "Customer",
      src: testimonial_1,
    },
    {
      quote:
        "Thank you for the clothes!! I love them and always get a lot of compliments whenever I wear one of your pieces! ",
      name: "Pouchka Duval Wille",
      designation: "Customer",
      src: testimonial_2,
    },
    {
      quote:
        "We absolutely loved our matching outfits! The quality is amazing and everything fit perfectly for our Christmas photos. Thank you Oli’s for making our celebration even more special❤️",
      name: "Ketim Olkaba",
      designation: "Customer",
      src: testimonial_3,
    },
    {
      quote:
        "I’m in love with my vest! Its versatility allows me to style it in various ways, and I receive compliments every time I wear it. Thank you for such a beautiful piece",
      name: "Hermela Richmond",
      designation: "Customer",
      src: testimonial_4,
    },
    {
      quote:
        "Oli’s knit 🧶, I see an amazing potential that can make a change in a fashion industry, me and my families are so grateful for making you a #1 choice for a Christmas outfit, specially the beautiful sweater you made for my baby boy (Hayyuu) was phenomenal. Keep up the good work.",
      name: "Milkesa Takele",
      designation: "Customer",
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
