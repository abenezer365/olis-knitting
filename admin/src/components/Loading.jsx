import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PuffLoader } from "react-spinners";

export default function Loading() {
  const [visible, setVisible] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  const messages = [
    "Knitting something beautiful...",
    "Crafting your fashion story...",
    "Finishing the final stitch...",
    "Ready to drape your style..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % messages.length);
    }, 1200);
    const timer = setTimeout(() => setVisible(false), 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#f8f8f8] to-[#eaeaea]"
      >
        {/* Moving cloth pattern background */}
        <motion.div
          animate={{ backgroundPositionX: ["0%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Loader and text content */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: [0.9, 1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col items-center"
        >
          <PuffLoader color="#b88b5a" size={80} />
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mt-8 text-gray-600 italic font-light text-sm tracking-wide"
            >
              {messages[textIndex]}
            </motion.p>
          </AnimatePresence>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-2 text-2xl font-bungee bg-linear-to-r from-[#b88b5a] via-[#a07540] to-[#b88b5a] bg-clip-text text-transparent"
          >
            Oli’s Knitwear
          </motion.h1>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
