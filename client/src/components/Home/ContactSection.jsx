import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { Link } from "react-router-dom"; // or your routing method

export default function ContactSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-bungee text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our knitting services? We're here to help and
            would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="bg-secondary border border-border rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Call Us
            </h3>
            <p className="text-muted-foreground mb-4">
              Available during business hours
            </p>
            <a
              href="tel:+251912273435"
              className="text-primary font-medium hover:underline"
            >
              +251 91 227 3435
            </a>
          </div>

          <div className="bg-secondary border border-border rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Email Us
            </h3>
            <p className="text-muted-foreground mb-4">We'll respond quickly</p>
            <a
              href="mailto:olis.knitting@gmail.com"
              className="text-primary font-medium hover:underline"
            >
              olis.knitting@gmail.com
            </a>
          </div>

          <div className="bg-secondary border border-border rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Visit Us
            </h3>
            <p className="text-muted-foreground mb-4">Come see our products</p>
            <p className="text-foreground">Alfoz Plaza, Gerji</p>
          </div>
        </div>

        {/* Quick Contact & CTA */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 border border-border rounded-xl p-8">
          <div>
            <h3 className="text-2xl font-bungee text-foreground mb-2">
              Ready to discuss your project?
            </h3>
            <p className="text-muted-foreground">
              Send us a message or chat directly on WhatsApp or Telegram
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Quick Chat Buttons */}
            <div className="flex gap-3">
              <a
                href="https://wa.me/251912273435"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp</span>
              </a>

              <a
                href="https://t.me/Olisknitting"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <FaTelegramPlane size={18} />
                <span>Telegram</span>
              </a>
            </div>

            {/* Full Contact Page Link */}
            <Link
              to="/contact" // Update this to your contact page route
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <span>Contact Form</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
