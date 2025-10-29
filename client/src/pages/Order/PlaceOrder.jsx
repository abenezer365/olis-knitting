import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  Send,
  Instagram,
} from "lucide-react";
import { useGlobalContext } from "@/contexts/Context";

function PlaceOrder() {
  const { cart, updateQuantity, removeFromCart, total } = useGlobalContext();
  const navigate = useNavigate();

  const [currency, setCurrency] = useState("USD");
  const [paymentMethod, setPaymentMethod] = useState("whatsapp");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    country: "Ethiopia",
    city: "",
    postalCode: "",
  });

  const exchangeRate = 160;

  const getPrice = (price) =>
    currency === "ETB"
      ? `${(price * exchangeRate).toFixed(2)} ETB`
      : `$${price.toFixed(2)}`;
  // keep total in base USD — don't multiply here (avoids double conversion)
  const totalPrice = total;

  const handlePlaceOrder = () => {
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill in all customer information");
      return;
    }
    if (!shippingInfo.address || !shippingInfo.city) {
      alert("Please fill in all shipping information");
      return;
    }

    const orderId = Math.random().toString(36).substring(2, 15);

    navigate(`/order_confirmation/${orderId}`, {
      state: {
        customerInfo,
        shippingInfo,
        items: cart,
        total: totalPrice,
        currency,
        paymentMethod,
        subscribeNewsletter,
      },
    });
  };

  if (cart.length === 0) {
    return (
      <div className=" flex flex-col bg-background/50">
        <div className="flex-1 container mx-auto px-4 py-26 text-center">
          <h1 className="text-4xl font-display mb-4">No Items in Order</h1>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart to place an order
          </p>
          <Button asChild>
            <Link to="/products">Go Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background/50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display mb-8">Place Your Order</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={customerInfo.fullName}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          city: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Label>Currency:</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="ETB">ETB (Br)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.color || "default"}-${
                      item.size || "default"
                    }`}
                    className="flex gap-4 p-4 bg-muted rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
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
                      <p className="font-semibold mt-1">
                        {getPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, (item.quantity || 1) - 1),
                              item.color,
                              item.size
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">
                          {item.quantity || 1}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              (item.quantity || 1) + 1,
                              item.color,
                              item.size
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() =>
                        removeFromCart({
                          id: item.id,
                          color: item.color,
                          size: item.size,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      {getPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Items:</span>
                    <span>
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Contact Seller Via:</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center">
                          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                        </div>
                      </SelectItem>
                      <SelectItem value="telegram">
                        <div className="flex items-center">
                          <Send className="mr-2 h-4 w-4" /> Telegram
                        </div>
                      </SelectItem>
                      <SelectItem value="instagram">
                        <div className="flex items-center">
                          <Instagram className="mr-2 h-4 w-4" /> Instagram
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payment will be arranged through your selected platform
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={subscribeNewsletter}
                    onCheckedChange={(checked) =>
                      setSubscribeNewsletter(checked)
                    }
                  />
                  <Label
                    htmlFor="newsletter"
                    className="text-sm cursor-pointer"
                  >
                    Subscribe to newsletter for exclusive offers
                  </Label>
                </div>

                <Button
                  variant="luxury"
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PlaceOrder;
