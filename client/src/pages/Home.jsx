import AboutSection from "@/components/Home/AboutSection";
import FeaturedPieces from "@/components/Home/FeaturedPieces";
import HeroSection from "@/components/Home/HeroSection";
import TestimonialSection from "@/components/Home/TestimonialSection";
import "../styles/root.css";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedPieces />
      <AboutSection />
      <TestimonialSection />
      <FAQSection />
    </main>
  );
}
