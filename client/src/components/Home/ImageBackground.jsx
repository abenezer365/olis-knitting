import bgImage from "../../assets/3a.webp"; // your image file

const ImageBackground = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-accent h-full gap-4 px-4">
        <p className="text-lg sm:text-xl md:text-2xl uppercase  tracking-widest">
          Your Next Move Starts Here
        </p>
        <h1 className="text-6xl sm:text-6xl md:text-8xl lg:text-9xl hero-text text-accent">
          Oli's
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl">Addis Ababa, Ethiopia</p>
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
