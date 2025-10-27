import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Context } from "@/contexts/Context";
import { Type } from "@/utils/action.type";

function PlaceOrder() {
  const navigate = useNavigate();
  const [{ basket }, dispatch] = useContext(Context);
  const [formData, setFormData] = useState({
    customerName: basket?.customerName || "",
    email: basket?.email || "",
    phone: basket?.phone || "",
    address: basket?.address || "",
    country: basket?.country || "",
    city: basket?.city || "",
    postalCode: basket?.postalCode || "",
    currency: basket?.currency || "USD",
    paymentMethod: basket?.paymentMethod || "whatsapp",
    subscribeNewsletter: basket?.subscribeNewsletter || false,
  });
  console.log(basket)
  const displayItems = Array.isArray(basket) ? basket : (basket?.items || []);
  const total = displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlaceOrder = () => {
    if (!formData.customerName || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill in all required fields");
      return;
    }

    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    navigate(`/order/${orderId}`);
  };

  if (displayItems.length == 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              No products yet. Start shopping to place an order.
            </p>
            <Link to="/products">
              <Button size="lg">Go to Shopping</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <h1 className="text-4xl font-bold mb-8">Place Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Customer Information</h2>
              <div className="space-y-4">
                {[
                  { label: "Full Name *", name: "customerName", type: "text", placeholder: "John Doe" },
                  { label: "Email *", name: "email", type: "email", placeholder: "john@example.com" },
                  { label: "Phone Number *", name: "phone", type: "tel", placeholder: "+1 (555) 000-0000" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium mb-2">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="United States"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="New York"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {["whatsapp", "telegram", "instagram"].map((method) => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="capitalize font-medium">{method}</span>
                    <span className="text-sm text-muted-foreground">
                      (Contact admin via {method})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-card border border-border rounded-lg p-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="font-medium">Subscribe to our newsletter</span>
              </label>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Products */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {displayItems?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b border-border items-center"
                  >
                    <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() =>
                            dispatch({ type: Type.DECREMENT_ITEM, item: item })
                          }
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 border border-border rounded"
                        >
                          -
                        </button>
                        <span>{item.amount}</span>
                        <button
                          onClick={() =>
                            dispatch({ type: Type.INCREMENT_ITEM, item: item })
                          }
                          className="px-2 py-1 border border-border rounded"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">
                        Qty: {item.amount}
                      </p>
                      <p className="text-sm font-bold text-primary">
                        ${(item.price * item.amount).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        dispatch({ type: Type.REMOVE_FROM_CART, item: item })
                      }
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Currency */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="USD">USD</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formData.currency === "ETH"
                      ? `${(total * 0.0016).toFixed(4)} ETH`
                      : `$${total.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button onClick={handlePlaceOrder} className="w-full" size="lg">
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PlaceOrder;
