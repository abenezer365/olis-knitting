import { Link } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function Unavailable() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Page Not Found";
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
    }, 100);

    return () => clearInterval(typingEffect);
  }, []);

  return (
    <div className="bg-background flex items-center justify-center p-4">
      <div className={`text-center max-w-md transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="h-16 w-16 text-accent" />
          </div>
          <div className="absolute inset-0 border-4 border-accent/30 rounded-full animate-ping"></div>
        </div>

        {/* Typing Text Effect */}
        <h1 className="text-6xl font-bold mb-4 font-mono bg-linear-to-r from-foreground to-accent bg-clip-text text-transparent">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-2">
          404
        </p>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to familiar territory.
        </p>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild className="gap-2 bg-accent hover:bg-accent/80">
            <Link to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>

        {/* Subtle Background Animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default Unavailable;