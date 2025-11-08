import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Check } from "lucide-react";
import { SlSocialInstagram } from "react-icons/sl";
import { PiTelegramLogoDuotone, PiTiktokLogoLight } from "react-icons/pi";

import { useState } from "react";
import logo from "/logo.png";

function Footer() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubscribed(true);

    // Reset the animation after 3 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 inline-block">
              <img src={logo} alt="" className="h-10" />
            </Link>{" "}
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
            <p className="text-primary-foreground/80 mb-2 hover:text-white">
              <a href="mailto:olis.knitting@gmail.com">
                olis.knitting@gmail.com
              </a>
            </p>
            <p className="text-primary-foreground/80">
              <a href="tel:+251-912-273435">Call Us</a>
            </p>
            <p className="text-primary-foreground/80 mt-2">
              Addis Ababa, Ethiopia
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                target="_blank"
                href="https://t.me/Olisknitting"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <PiTelegramLogoDuotone size={20} />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/_olis_?igsh=MnZwZDJ1OWhjNnpv&utm_source=qr"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <SlSocialInstagram size={20} />
              </a>
              <a
                href="http://www.tiktok.com/@__oli.s__"
                target="_blank"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <PiTiktokLogoLight size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-primary-foreground/20 pt-12 mb-12">
          <h4 className="font-semibold mb-4">Subscribe to Our Newsletter</h4>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-all duration-300 font-medium relative overflow-hidden min-w-[120px]"
              disabled={isSubscribed}
            >
              <span
                className={`flex items-center justify-center transition-all duration-300 ${
                  isSubscribed ? "scale-0" : "scale-100"
                }`}
              >
                Subscribe
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  isSubscribed ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <Check size={20} className="mr-2" />
                Subscribed!
              </span>
            </button>
          </form>
          {isSubscribed && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-center transition-all duration-500 ease-in-out transform">
              <p className="text-green-300 font-medium flex items-center justify-center">
                <Check className="w-4 h-4 mr-2" />
                Thank you for subscribing! Welcome to the OLI family.
              </p>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>
            &copy; {currentYear} Oli's Knitting & Fashion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
