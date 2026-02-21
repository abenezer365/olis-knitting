import { Link } from "react-router-dom";
import { Lock, ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Unauthorized() {
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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_70%)]" />
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-destructive/5 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-destructive/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }} />

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
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-40 h-40 bg-card border border-destructive/20 rounded-full flex items-center justify-center mx-auto shadow-2xl backdrop-blur-sm"
          >
            <ShieldAlert className="h-20 w-20 text-destructive stroke-[1.5px]" />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -inset-6 border-2 border-destructive/10 rounded-full -z-10"
          />
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-8 bg-destructive/30" />
            <span className="text-xs font-bold tracking-widest text-destructive uppercase">Access Restricted</span>
            <span className="h-px w-8 bg-destructive/30" />
          </div>

          <h1 className="text-6xl font-black mb-6 tracking-tight text-foreground">
            Entry Denied
          </h1>

          <p className="text-lg text-muted-foreground mb-12 leading-relaxed max-w-md mx-auto">
            Your current credentials do not grant access to this sanctuary.
            Please return to the main hall or contact your supervisor.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button asChild variant="outline" className="h-14 px-8 rounded-full border-border hover:bg-secondary gap-3 transition-all duration-300">
            <Link to={-1}>
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </Link>
          </Button>

          <Button asChild className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-3 transition-all duration-300">
            <Link to="/">
              <Home className="h-4 w-4" />
              <span>Login Page</span>
            </Link>
          </Button>
        </motion.div>


        {/* Security Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-xs text-muted-foreground mt-12 font-medium tracking-wide flex items-center justify-center gap-2"
        >
          <Lock className="w-3 h-3" />
          SECURE SYSTEM PROTOCOL ACTIVE
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Unauthorized;
