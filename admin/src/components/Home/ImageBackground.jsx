import bgImage from "../../assets/3a.webp"; // your image file
import heroImg from "/hero-logo.png";

const ImageBackground = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-accent h-full gap-4 px-4">
        <img src={heroImg} alt="Hero Logo" className="w-3/4 max-w-2xl" />
      </div>

      {/* Replace video with image */}
      <img
        src={bgImage}
        alt="Background"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />
    </div>
  );
};

export default ImageBackground;
