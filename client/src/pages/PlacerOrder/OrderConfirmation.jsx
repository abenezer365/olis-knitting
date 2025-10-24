import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, MapPin, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function OrderConfirmation() {
  const { id: orderId } = useParams();
  const { orderData } = useCart();

  if (!orderData) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <Link to="/products" className="mt-4 inline-block">
            <Button>Back to Shopping</Button>
          </Link>
        </div>
      </main>
    );
  }

  const total = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We'll be in touch soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order ID */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Order ID</h2>
              <p className="text-2xl font-mono font-bold text-primary">
                {orderId}
              </p>
            </div>

            {/* Delivery Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Delivery Information</h2>
              </div>
              <div className="space-y-2 text-foreground">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {orderData.customerName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {orderData.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {orderData.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {orderData.address}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {orderData.city},{" "}
                  {orderData.country}
                </p>
                {orderData.postalCode && (
                  <p>
                    <span className="font-semibold">Postal Code:</span>{" "}
                    {orderData.postalCode}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Payment Status</h2>
              </div>
              <div className="space-y-2">
                <p className="text-foreground">
                  <span className="font-semibold">Method:</span>{" "}
                  {orderData.paymentMethod.toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Our team will contact you via {orderData.paymentMethod} to
                  complete the payment.
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Order Items</h2>
              </div>
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-border last:border-b-0"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">TBD</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    {orderData.currency === "ETH"
                      ? `${(total / 2000).toFixed(4)} ETH`
                      : `$${total.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  A confirmation email has been sent to{" "}
                  <span className="font-semibold">{orderData.email}</span>
                </p>
              </div>

              <Link to="/products" className="block">
                <Button className="w-full bg-transparent" variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
