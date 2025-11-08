// import image from "../../assets/3.webp";
import image from "../../assets/aboutUs-1.jpg";
function AboutSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-bungee text-foreground mb-6">
              About Us
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Oli’s is Ethiopia’s knitwear brand dedicated to blending knitted
              garments with modern design. our collections offer versatile,
              contemporary knitwear for both women and men pieces that
              effortlessly transition from casual to elegant, from day to night.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Our garments are designed to inspire confidence and
              self-expression. With structured paneling, draping, and ruching,
              each piece celebrates individuality and strength, while
              versatility ensures that every item adapts to the wearer’s
              lifestyle. At Oli’s, fashion is not just about style; it’s about
              culture, empowerment, and craftsmanship.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden bg-muted h-146 ">
            <img
              src={image}
              alt="Our studio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
