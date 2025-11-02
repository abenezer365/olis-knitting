import { Link } from "react-router-dom";
import { Shield, Lock, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function Unauthorized() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Access Denied";
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });

  useEffect(() => {
    setIsVisible(true);
    
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, 80);

    return () => clearInterval(typingEffect);
  }, []);

  return (
    <div className="bg-background flex items-center justify-center p-4">
      <div className={`text-center max-w-md transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Animated Lock Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Lock className="h-16 w-16 text-destructive" />
          </div>
          <div className="absolute -inset-4 border-4 border-destructive/20 rounded-full animate-ping"></div>
        </div>

        {/* Typing Text Effect */}
        <h1 className="text-5xl font-bold mb-4 font-mono bg-linear-to-r from-destructive to-accent bg-clip-text text-transparent">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>

        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            You are unauthorized
          </p>
          <Shield className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          This area requires special permissions. 
          It seems you've stumbled upon a restricted section. 
          Don't worry, even the best explorers get lost sometimes!
        </p>

        {/* Animated Security Dots */}
        <div className="flex justify-center gap-1 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 h-1 bg-destructive rounded-full animate-bounce"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Safety
            </Link>
          </Button>
          <Button asChild className="gap-2 bg-accent hover:bg-accent/80">
            <Link to="/">
              <ArrowRight className="h-4 w-4" />
              Get Access
            </Link>
          </Button>
        </div>

        {/* Fun Message */}
        <p className="text-xs text-muted-foreground mt-8 italic">
          🔒 This area is protected by digital dragons
        </p>

        {/* Background Security Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-destructive/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;