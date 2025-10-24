import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-stretch">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bungee text-foreground mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Address
                      </h3>
                      <p className="text-muted-foreground">
                        Addis Ababa, Ethiopia
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Phone
                      </h3>
                      <p className="text-muted-foreground">+251 911 234 567</p>
                      <p className="text-muted-foreground">+251 922 345 678</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Email
                      </h3>
                      <p className="text-muted-foreground">
                        info@olifashion.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="mt-8">
                <h2 className="text-2xl font-bungee text-foreground mb-4">
                  Location
                </h2>
                <div className="w-full h-80 bg-secondary rounded-lg overflow-hidden border border-border">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.6829271099!2d38.74677!3d9.03212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cecc7c1d4d%3A0x1234567890!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2set!4v1234567890"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {/* Contact Form */}
              <div className="bg-secondary border border-border rounded-lg p-8 flex-1 flex flex-col">
                <h2 className="text-2xl font-bungee text-foreground mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <label className=" text-lg font-medium text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className=" text-lg font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="block text-lg font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Send Message
                  </button>

                  {submitted && (
                    <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}
                </form>
              </div>
              {/* Quick Contact Buttons */}
              <div className="">
                <h2 className="text-2xl font-bungee text-foreground my-2">
                  Quick Contact
                </h2>
                <div className="flex gap-4">
                  {/* WhatsApp Button */}
                  <a
                    href="https://wa.me/251911234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <FaWhatsapp
                      size={22}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="relative">
                      Chat on WhatsApp
                      {/* Animated underline */}
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </a>

                  {/* Telegram Button */}
                  <a
                    href="https://t.me/olifashion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <FaTelegramPlane
                      size={22}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="relative">
                      Chat on Telegram
                      {/* Animated underline */}
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
