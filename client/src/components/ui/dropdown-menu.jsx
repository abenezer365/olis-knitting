// components/ui/dropdown-menu.jsx
import React, { useState, useRef, useEffect } from "react";

const DropdownMenu = ({ children, className }) => {
  return (
    <div className={`relative inline-block text-left ${className}`}>
      {children}
    </div>
  );
};

const DropdownMenuTrigger = React.forwardRef(({ children, className, asChild, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(({ 
  children, 
  className, 
  align = "end", 
  sideOffset = 4, 
  ...props 
}, ref) => {
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0"
  };

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 w-56 rounded-md border border-accent/20 bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${alignmentClasses[align]} ${className}`}
      style={{ marginTop: `${sideOffset}px` }}
      {...props}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ 
  children, 
  className, 
  inset, 
  onSelect,
  ...props 
}, ref) => {
  const handleClick = (e) => {
    if (onSelect) {
      e.preventDefault();
      onSelect();
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      ref={ref}
      className={`w-full text-left flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer ${
        inset ? "pl-8" : ""
      } ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef(({ children, className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={`px-4 py-2 text-sm font-semibold text-popover-foreground ${
      inset ? "pl-8" : ""
    } ${className}`}
    {...props}
  >
    {children}
  </div>
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={`-mx-1 my-1 border-t border-accent/20 ${className}`}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuGroup = React.forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
DropdownMenuGroup.displayName = "DropdownMenuGroup";

// Hook for dropdown functionality
export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return {
    isOpen,
    toggle,
    close,
    open,
    dropdownRef
  };
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
};