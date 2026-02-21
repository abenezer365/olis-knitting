import { Link } from "react-router-dom";
import { Home, ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Unavailable() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(212,197,176,0.1),transparent_70%)]" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center max-w-2xl relative"
      >
        {/* Animated Icon Container */}
        <div className="relative mb-12 inline-block">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-40 h-40 bg-card border border-border/40 rounded-full flex items-center justify-center mx-auto shadow-2xl backdrop-blur-sm"
          >
            <Ghost className="h-20 w-20 text-accent stroke-[1.5px]" />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -inset-4 border-2 border-accent/20 rounded-full -z-10"
          />
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-8xl font-black mb-6 tracking-tighter text-foreground selection:bg-accent selection:text-accent-foreground">
            404
          </h1>

          <h2 className="text-3xl font-bold mb-6 text-foreground/90 tracking-tight">
            Lost in Elegance
          </h2>

          <p className="text-lg text-muted-foreground mb-12 leading-relaxed max-w-md mx-auto">
            The page you are seeking has vanished into the threads of our collection.
            Allow us to lead you back to the sanctuary.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button asChild variant="outline" className="h-14 px-8 rounded-full border-accent/30 hover:bg-accent/5 gap-3 transition-all duration-300">
            <Link to={-1}>
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </Link>
          </Button>

          <Button asChild className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-3 transition-all duration-300">
            <Link to="/">
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </Button>
        </motion.div>


        {/* Decorative Lines */}
        <div className="absolute -left-20 top-1/2 w-40 h-px bg-linear-to-r from-transparent via-accent/20 to-transparent rotate-45" />
        <div className="absolute -right-20 top-1/2 w-40 h-px bg-linear-to-r from-transparent via-accent/20 to-transparent -rotate-45" />
      </motion.div>
    </div>
  );
}

export default Unavailable;
