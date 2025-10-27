import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What products does Oli's offer?",
    answer:
      "We specialize in handmade knitwear including sweaters, scarves, hats, and other luxury fashion items.",
  },
  {
    question: "How can I place an order?",
    answer:
      "Currently, orders can be placed via WhatsApp or Telegram by contacting us directly through the product detail page.",
  },
  {
    question: "Does Oli's deliver outside Ethiopia?",
    answer:
      "Not at this time, but international delivery will be added in the future.",
  },
  {
    question: "Are the products handmade?",
    answer:
      "Yes, each piece is carefully handcrafted by skilled women artisans.",
  },
  {
    question: "Can I request custom designs or colors?",
    answer:
      "Yes, custom orders can be discussed through our WhatsApp or Telegram support.",
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
