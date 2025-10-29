import AboutSection from "@/components/Home/AboutSection";
import TestimonialSection from "@/components/Home/TestimonialSection";
import FAQSection from "@/components/Home/FAQSection";
import ImageBackground from "@/components/Home/ImageBackground";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import AppleCardsCarouselDemo from "@/components/Home/AppleCardsCarouselDemo";

export default function Home() {
  return (
    <main>
      <ImageBackground />
      <FeaturedProducts />
      <AppleCardsCarouselDemo />
      <AboutSection />
      <TestimonialSection />
      <FAQSection />
    </main>
  );
}
