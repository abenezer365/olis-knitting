import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, LogIn, Menu, X, Trash2, LayoutDashboard  } from "lucide-react";
import { GlobalContext, useGlobalContext } from "@/contexts/Context";
import axios from "@/utils/axios.instance";
import { toast } from "sonner";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { cart, updateQuantity, removeFromCart, total, itemCount } = useGlobalContext();
  const {setUser, clearUser, user} = useContext(GlobalContext)


  const formatPrice = (price) => `$${price.toFixed(2)}`;

  const removeItem = (idOrPayload) => {
    removeFromCart(idOrPayload);
  };

  const handleUpdateQuantity = (id, newAmount, color, size) => {
    if (newAmount <= 0) {
      removeFromCart({ id, color, size });
    } else {
      updateQuantity(id, newAmount, color, size);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post('/user/signin',
        { email, password }
      )
      if (res.data.success) {
        const token = res.data.token;

        localStorage.setItem('token', token);

        const res2 = await axios.get('/user/check', {
            headers: { Authorization: `Bearer ${token}` },
          });

        if (res2.data.success) {
          setUser(res2.data.user)
        } else {
          localStorage.removeItem('token');
          clearUser()
        }
        setIsLoginOpen(false)
        navigate("/dashboard")
        toast.success("Login successfull")
      } else {
        setError(res.data.message || "Invalid credentials")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.")
      toast.error("Error occured")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!error) return; // only run if there’s an error message
    const timer = setTimeout(() => {
      setError(null)
    }, 3000);

    return () => clearTimeout(timer); // cleanup when error changes or component unmounts
  }, [error]);


  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <div className="text-2xl font-bold font-bungee text-foreground">
                OLI
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink
                to="/story"
                className={({ isActive }) =>
                  `text-foreground transition-colors hover:text-[#f8a532]  ${
                    isActive ? "text-[#f8a532] border-b border-black" : ""
                  }`
                }
              >
                Story
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `text-foreground transition-colors hover:text-[#f8a532]  ${
                    isActive ? "text-[#f8a532] border-b border-black" : ""
                  }`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/place_order"
                className={({ isActive }) =>
                  `text-foreground transition-colors hover:text-[#f8a532]  ${
                    isActive ? "text-[#f8a532] border-b border-black" : ""
                  }`
                }
              >
                Place Order
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-foreground transition-colors hover:text-[#f8a532]  ${
                    isActive ? "text-[#f8a532] border-b border-black" : ""
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
                {
                  user ? 
                  <Link to="/dashboard">
                    <button
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      aria-label="Login"
                    >
                      <LayoutDashboard  size={20} />
                    </button>
                  </Link>
                  : 
                  <button
                    onClick={() => setIsLoginOpen(!isLoginOpen)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Login"
                  >
                    <LogIn size={20} />
                  </button>
                }

              {/* Mobile Menu Toggle */}
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
              <NavLink
                to="/story"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-foreground transition-colors hover:text-white hover:bg-muted-foreground p-4 ${
                    isActive ? "text-white bg-muted-foreground/60 " : ""
                  }`
                }
              >
                Story
              </NavLink>
              <NavLink
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-foreground transition-colors hover:text-white  hover:bg-muted-foreground p-4 ${
                    isActive ? "text-white bg-muted-foreground/60" : ""
                  }`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-foreground transition-colors hover:text-white  hover:bg-muted-foreground p-4 ${
                    isActive ? "text-white bg-muted-foreground/60" : ""
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>
          )}
        </div>
      </header>

      {/* CART MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border shadow-lg overflow-y-auto">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-secondary rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground flex-1 flex items-center justify-center">
                  Your cart is empty
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.color || "default"}-${
                          item.size || "default"
                        }`}
                        className="flex gap-4 bg-secondary p-4 rounded-lg"
                      >
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          {item.color && (
                            <p className="text-sm text-muted-foreground">
                              Color: {item.color}
                            </p>
                          )}
                          {item.size && (
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size}
                            </p>
                          )}
                          <p className="text-primary font-bold">
                            {formatPrice(item.price)}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.quantity - 1,
                                  item.color,
                                  item.size
                                )
                              }
                              className="px-2 py-1 bg-background rounded hover:bg-border transition-colors"
                            >
                              −
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                  item.color,
                                  item.size
                                )
                              }
                              className="px-2 py-1 bg-background rounded hover:bg-border transition-colors"
                            >
                              +
                            </button>
                            <button
                              onClick={() =>
                                removeItem({
                                  id: item.id,
                                  color: item.color,
                                  size: item.size,
                                })
                              }
                              className="ml-auto p-1 hover:bg-red-100 rounded transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total + Checkout */}
                  <div className="border-t border-border pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <Link
                      to="/place_order"
                      className="block"
                      onClick={() => setIsCartOpen(false)}
                    >
                      <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity font-medium">
                        Place Order
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
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

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              {error && <p className="text-red-500 font- text-center">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
