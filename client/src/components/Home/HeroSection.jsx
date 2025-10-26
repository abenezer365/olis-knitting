function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-linear-to-b from-secondary to-background overflow-hidde">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-semibold font-sans text-foreground mb-6 text-balance">
          Crafted Luxury
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Discover our exquisite collection of handcrafted knitwear and luxury
          fashion pieces
        </p>
        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium">
          Explore Collection
        </button>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}

export default HeroSection;
