import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AboutSection from "@/components/Home/AboutSection";
import FeaturedPieces from "@/components/Home/FeaturedPieces";
import HeroSection from "@/components/Home/HeroSection";
import TestimonialSection from "@/components/Home/TestimonialSection";
import "../styles/root.css";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedPieces />
      <AboutSection />
      <TestimonialSection />
    </main>
  );
}
