import AboutSection from "@/components/Home/AboutSection";
import FeaturedPieces from "@/components/Home/FeaturedPieces";
import TestimonialSection from "@/components/Home/TestimonialSection";
import FAQSection from "@/components/Home/FAQSection";
import ImageBackground from "@/components/Background/ImageBackground";

export default function Home() {
  return (
    <main>
      <ImageBackground />
      {/* <HeroSection /> */}
      <FeaturedPieces />
      <AboutSection />
      <TestimonialSection />
      <FAQSection />
    </main>
  );
}
