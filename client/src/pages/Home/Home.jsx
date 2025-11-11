import AboutSection from "@/components/Home/AboutSection";
import TestimonialSection from "@/components/Home/TestimonialSection";
import FAQSection from "@/components/Home/FAQSection";
import ImageBackground from "@/components/Home/ImageBackground";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import AppleCardsCarouselDemo from "@/components/Home/AppleCardsCarouselDemo";
import { useEffect } from "react";
import ContactSection from "@/components/Home/ContactSection";

export default function Home() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
  return (
    <main>
      <ImageBackground />
      <FeaturedProducts />
      <AppleCardsCarouselDemo />
      <AboutSection />
      <TestimonialSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}
