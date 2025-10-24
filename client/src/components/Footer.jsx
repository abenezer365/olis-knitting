import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold font-bungee mb-2">OLI</h3>
            <p className="text-primary-foreground/80">
              Crafted luxury for the modern wardrobe
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/story"
                  className="text-primary-foreground/80 hover:text-var(--primary-foreground) transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-primary-foreground/80 mb-2">
              Email: hello@olifashion.com
            </p>
            <p className="text-primary-foreground/80">
              Phone: +1 (555) 123-4567
            </p>
            <p className="text-primary-foreground/80 mt-2">
              New York, NY 10001
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-primary-foreground/20 pt-12 mb-12">
          <h4 className="font-semibold mb-4">Subscribe to Our Newsletter</h4>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2025 Oli's Knitting & Fashion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
