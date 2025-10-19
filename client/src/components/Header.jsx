import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, LogIn, Menu, X } from "lucide-react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="text-2xl font-bold font-bungee text-foreground">
                OLI
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/story"
                className="text-foreground hover:text-accent transition-colors"
              >
                Story
              </Link>
              <Link
                to="/products"
                className="text-foreground hover:text-accent transition-colors"
              >
                Products
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-accent transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => (window.location.href = "/wishlist")}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </button>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} />
              </button>
              <button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Login"
              >
                <LogIn size={20} />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-4">
              <Link
                to="/story"
                className="text-foreground hover:text-accent transition-colors"
              >
                Story
              </Link>
              <Link
                to="/products"
                className="text-foreground hover:text-accent transition-colors"
              >
                Products
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-accent transition-colors"
              >
                Contact
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-secondary rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="text-center py-12 text-muted-foreground">
                Your cart is empty
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsLoginOpen(false)}
          />
          <div className="relative bg-background border border-border rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Admin Login</h2>
              <button
                onClick={() => setIsLoginOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
