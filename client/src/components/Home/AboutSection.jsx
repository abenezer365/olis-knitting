export default function AboutSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-bungee text-foreground mb-6">
              About Us
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Oli's Knitting & Fashion was founded with a passion for creating
              timeless pieces that celebrate craftsmanship and quality. Each
              garment is carefully designed and produced to ensure the highest
              standards.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe in sustainable fashion and ethical production
              practices. Our commitment to excellence is reflected in every
              stitch and every piece we create.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden bg-muted h-96">
            <img
              src="https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80"
              alt="Our studio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
