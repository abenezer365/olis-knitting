import { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import axios from "@/utils/axios.instance";
import { toast } from "sonner";

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/message/writeMessage", formData);
      console.log("Message sent:", res.data);
      setSubmitted(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
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
                    <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Address
                      </h3>
                      <p className="text-muted-foreground">
                        Alfoz Plaza, Gerji
                      </p>
                      <p className="text-muted-foreground">House No. 207</p>
                      <p className="text-muted-foreground">
                        Addis Ababa, Ethiopia
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Phone
                      </h3>
                      <p className="text-muted-foreground">+251 95 651 8897</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Email
                      </h3>
                      <p className="text-muted-foreground">
                        olis.knitting@gmail.com{" "}
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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4823.610540961836!2d38.80089000837881!3d9.001019580970228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85fbd2ed7267%3A0xbb12a87bd17aa9aa!2sAlfoz%20Plaza%20%7C%20Gerji!5e0!3m2!1sen!2set!4v1762351981045!5m2!1sen!2set"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
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
                  {/* First Name */}
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-foreground text-nowrap">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      placeholder="First name"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-foreground text-nowrap">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      placeholder="Last name"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-foreground text-nowrap">
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

                  {/* Subject */}
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-foreground text-nowrap">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      placeholder="Subject..."
                    />
                  </div>

                  {/* Message */}
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
                    href="https://wa.me/251956518897"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <FaWhatsapp
                      size={22}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="relative">
                      Chat on WhatsApp
                      {/* Animated underline */}
                      <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </a>

                  {/* Telegram Button */}
                  <a
                    href="https://t.me/Olisknitting"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-linear-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <FaTelegramPlane
                      size={22}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="relative">
                      Chat on Telegram
                      {/* Animated underline */}
                      <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
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
