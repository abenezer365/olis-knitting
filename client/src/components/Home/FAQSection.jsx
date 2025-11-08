import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do you ship worldwide?",
    answer:
      "Yes! We ship internationally via DHL. Please note that shipping costs are covered by our clients.",
  },
  {
    question: "How do I provide my measurements?",
    answer:
      "We’ve made it simple — just refer to the size chart available under each product in our store and choose your size accordingly.",
  },
  {
    question: "Are your products pre-order or ready to purchase?",
    answer: "All our products are available as pre-orders.",
  },
  {
    question: "How long does it take to prepare my order?",
    answer: "Our team carefully prepares each order within 5 working days.",
  },
  {
    question: "Are your products Habesha tilet?",
    answer:
      "Our pieces are primarily knitted, though we sometimes incorporate woven fabrics and other materials for unique designs.",
  },
  {
    question: "How can I place an order?",
    answer:
      "Currently, orders can be placed via WhatsApp or Telegram by contacting us directly through the product detail page.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-bungee text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our products and services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary transition-colors"
              >
                <h3 className="font-semibold text-foreground text-left">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-secondary border-t border-border">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
