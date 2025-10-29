import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageCircle, Send, Instagram } from "lucide-react";
import { useGlobalContext } from "@/contexts/Context";

function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const { state: orderData } = location;

  // eslint-disable-next-line no-unused-vars
  const { cart, total, clearCart } = useGlobalContext();

  useEffect(() => {
    // Clear cart after successful order if provider is available
    if (clearCart) clearCart();
  }, [clearCart]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-display mb-4">Order Not Found</h1>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const {
    customerInfo,
    shippingInfo,
    items,
    total: orderTotal,
    currency,
    paymentMethod,
  } = orderData;

  // Currency exchange rate (1 USD = X ETB). Keep consistent with OrderPage.
  const exchangeRate = 160;

  const computedTotal =
    orderTotal ??
    total ??
    items?.reduce(
      (s, it) => s + (it.price || 0) * (it.quantity ?? it.amount ?? 1),
      0
    );

  const getContactLink = () => {
    // Display total in selected currency for the contact message
    const displayTotal =
      currency === "ETB"
        ? (computedTotal * exchangeRate).toFixed(2)
        : computedTotal.toFixed(2);
    const displayTotalLabel =
      currency === "ETB" ? `${displayTotal} ETB` : `$${displayTotal}`;

    const message = encodeURIComponent(
      `Hello! I would like to complete my order #${orderId}\n\nCustomer: ${customerInfo.fullName}\nEmail: ${customerInfo.email}\nPhone: ${customerInfo.phone}\n\nShipping Address:\n${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}\n\nTotal: ${displayTotalLabel}`
    );

    switch (paymentMethod) {
      case "whatsapp":
        return `https://wa.me/251911234567?text=${message}`;
      case "telegram":
        return `https://t.me/olis_fashion?text=${message}`;
      case "instagram":
        return "https://instagram.com/olis_fashion";
      default:
        return `https://wa.me/251911234567?text=${message}`;
    }
  };

  const getContactIcon = () => {
    switch (paymentMethod) {
      case "whatsapp":
        return <MessageCircle className="h-5 w-5" />;
      case "telegram":
        return <Send className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-display mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your order. Your order ID is:{" "}
              <span className="font-semibold">#{orderId}</span>
            </p>
          </div>

          {/* Contact Seller */}
          <Card className="mb-8 border-accent">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">
                Complete Your Payment
              </h3>
              <p className="text-muted-foreground mb-4">
                Click the button below to contact our team and arrange payment
              </p>
              <Button variant="luxury" size="lg" asChild>
                <a
                  href={getContactLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getContactIcon()}
                  <span className="ml-2">
                    Contact via{" "}
                    {paymentMethod?.charAt(0).toUpperCase() +
                      paymentMethod?.slice(1)}
                  </span>
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(items || []).map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
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
                    <p className="text-sm">
                      Quantity: {item.quantity ?? item.amount ?? 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {currency === "ETB"
                        ? `${(
                            (item.price || 0) *
                            (item.quantity ?? item.amount ?? 1) *
                            exchangeRate
                          ).toFixed(2)} ETB`
                        : `$${(
                            (item.price || 0) *
                            (item.quantity ?? item.amount ?? 1)
                          ).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total:</span>
                  <span>
                    {currency === "ETB"
                      ? `${(computedTotal * exchangeRate).toFixed(2)} ETB`
                      : `$${computedTotal.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-semibold">{customerInfo.fullName}</p>
                <p className="text-sm">{customerInfo.email}</p>
                <p className="text-sm">{customerInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Shipping Address
                </p>
                <p>{shippingInfo.address}</p>
                <p>
                  {shippingInfo.city}, {shippingInfo.country}
                </p>
                {shippingInfo.postalCode && <p>{shippingInfo.postalCode}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                Pending - Please contact us via{" "}
                {paymentMethod?.charAt(0).toUpperCase() +
                  paymentMethod?.slice(1)}{" "}
                to complete payment
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderConfirmation;
