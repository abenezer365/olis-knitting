import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "@/utils/axios.instance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Copy,
  CheckCheck,
  Calendar,
  User,
  Package,
  Truck,
  MapPin,
} from "lucide-react";
import { FaWhatsapp, FaTelegramPlane, FaInstagram } from "react-icons/fa";

function OrderConfirmation() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  const { uuid } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  const exchangeRate = 160;

  const getPrice = (price) => {
    const numPrice = parseFloat(price);
    return `$${numPrice.toFixed(2)} (${(numPrice * exchangeRate).toFixed(
      2
    )} ETB)`;
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      pending: { class: "bg-yellow-100 text-yellow-800", label: "Pending" },
      confirmed: { class: "bg-blue-100 text-blue-800", label: "Confirmed" },
      processing: {
        class: "bg-purple-100 text-purple-800",
        label: "Processing",
      },
      completed: { class: "bg-green-100 text-green-800", label: "Completed" },
      cancelled: { class: "bg-red-100 text-red-800", label: "Cancelled" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/order/get_by_uuid/${uuid}`);
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchOrderData();
    }
  }, [uuid]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success(`${field} copied to clipboard`);
  };

const generateOrderMessage = () => {
  if (!orderData) return "";

  const order = orderData;
  const customer = orderData.client || {};

  let items = orderData.products || []; // This is correct

  // ✅ Parse if backend sends it as a JSON string
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {
      console.warn("Failed to parse products JSON");
      items = [];
    }
  }

  // Debug: Check what items contains
  console.log("Items array:", items);
  console.log("Items length:", items.length);
  console.log("Items content:", JSON.stringify(items, null, 2));

  const itemList = items.length > 0 
    ? items
        .map((item) => `• ${item.name} (Qty: ${item.quantity}) - $${parseFloat(item.price).toFixed(2)}`)
        .join("\n")
    : "No items found.";

  return `
Hello! I would like to discuss payment for my order #${order.id}

Order Details:
${itemList}

Total Amount: $${parseFloat(order.total_amount).toFixed(2)}
Customer: ${customer.fname} ${customer.lname}
Email: ${customer.email}
Phone: ${customer.phone}

Please let me know the available payment options and next steps.
  `.trim();
};



  const handleSocialMediaRedirect = (platform) => {
    const message = encodeURIComponent(generateOrderMessage());
    const urls = {
      whatsapp: `https://wa.me/+251956518897?text=${message}`,
      telegram: `https://t.me/Olisknitting?text=${message}`,
      instagram: `https://instagram.com/_olis_`,
    };

    window.open(urls[platform], "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div>
            <h2 className="text-xl font-semibold">Loading Order Details</h2>
            <p className="text-muted-foreground">
              Preparing your order summary...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/50">
        <div className="text-center space-y-6">
          <Package className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground">
              The order you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const order = orderData;
  const customer = orderData.client || {};
  const items = orderData.products || [];

  return (
    <div className="min-h-screen bg-background/50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCheck className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 px-4">
            Order Confirmed!
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 px-4">
            Thank you for your purchase. We're preparing your order.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 my-5 px-4 sm:px-6">
            {/* Contact Actions */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl">
                  Complete Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Contact us to arrange payment and delivery. Your order details
                  will be shared automatically.
                </p>

                <div className="space-y-3">
                  {/* WhatsApp */}
                  <div
                    onClick={() => handleSocialMediaRedirect("whatsapp")}
                    className="group flex items-center gap-3 bg-linear-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium cursor-pointer"
                  >
                    <FaWhatsapp
                      size={20}
                      className="transition-transform duration-300 group-hover:scale-110 shrink-0"
                    />
                    <span className="relative text-sm sm:text-base">
                      Chat on WhatsApp
                      {/* Animated underline */}
                      <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </div>

                  {/* Telegram */}
                  <div
                    onClick={() => handleSocialMediaRedirect("telegram")}
                    className="group flex items-center gap-3 bg-linear-to-r from-sky-500 to-blue-600 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium cursor-pointer"
                  >
                    <FaTelegramPlane
                      size={20}
                      className="transition-transform duration-300 group-hover:scale-110 shrink-0"
                    />
                    <span className="relative text-sm sm:text-base">
                      Chat on Telegram
                      {/* Animated underline */}
                      <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </div>

                  {/* Instagram */}
                  <div
                    onClick={() => handleSocialMediaRedirect("instagram")}
                    className="group flex items-center gap-3 bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium cursor-pointer"
                  >
                    <FaInstagram
                      size={20}
                      className="transition-transform duration-300 group-hover:scale-110 shrink-0"
                    />
                    <span className="relative text-sm sm:text-base">
                      Chat on Instagram
                      {/* Animated underline */}
                      <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Button asChild variant="Transparent" className="w-full">
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Section */}
            <div className="space-y-6 lg:col-span-2">
              {/* Animated Tracking Link */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                    <Package className="h-6 w-6 text-accent animate-bounce" />
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground text-center">
                      Track Your Order
                    </h3>
                    <Truck
                      className="h-6 w-6 text-accent animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                    Use this link to track your order in real-time:
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md mx-auto">
                    <div className="flex-1 bg-background border border-border rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm truncate min-h-11 flex items-center">
                      {`${window.location.origin}/order/${order.uuid}`}
                    </div>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/order/${order.uuid}`
                          );
                          toast.success("Tracking link copied to clipboard!");
                        }}
                        className="flex-1 sm:flex-none min-h-11"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          window.open(`/order/${order.uuid}`, "_blank")
                        }
                        className="flex-1 sm:flex-none min-h-11 bg-accent hover:bg-accent/80"
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Bookmark this page for easy access to your order status
                  </p>
                </CardContent>
              </Card>

              {/* Status Display */}
              <div className=" flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm sm:text-base">
                Order Status: {getStatusDisplay(order.order_status)}
                Payment Status: {getStatusDisplay(order.payment_status)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.quantity}`}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{item.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Quantity: {item.quantity}</div>
                          <div>Price: ${parseFloat(item.price).toFixed(2)}</div>
                        </div>
                        <div className="font-semibold text-right">
                          ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Total */}
                <div className="border-t pt-4 mt-4 space-y-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Order Total:</span>
                    <span className="font-semibold">
                      {getPrice(order.total_amount)}
                    </span>
                  </div>

                  {/* Shipping Fee */}
                  {order.shipping_fee_id && (
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-muted-foreground">
                        Shipping Fee (per 0.5 kg):
                      </span>
                      <span className="font-semibold">
                        {getPrice(order.shipping_start)}
                      </span>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {order.shipping_country && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold text-sm">
                          Shipping Destination
                        </h4>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          {order.shipping_country} ({order.shipping_code})
                        </div>
                        {order.shipping_start && (
                          <div className="mt-1 text-xs">
                            Starting from $
                            {parseFloat(order.shipping_start).toFixed(2)}
                            {order.shipping_max && (
                              <span>
                                {" "}
                                up to $
                                {parseFloat(order.shipping_max).toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order ID:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">#{order.id}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        copyToClipboard(order.id.toString(), "Order ID")
                      }
                    >
                      {copiedField === "Order ID" ? (
                        <CheckCheck className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {order.shipping_country && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Shipping Method:
                    </span>
                    <span className="font-medium capitalize">
                      International ({order.shipping_code})
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Name</div>
                  <div className="font-medium">
                    {customer.fname} {customer.lname}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Email
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{customer.email}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => copyToClipboard(customer.email, "Email")}
                    >
                      {copiedField === "Email" ? (
                        <CheckCheck className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Phone
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{customer.phone}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => copyToClipboard(customer.phone, "Phone")}
                    >
                      {copiedField === "Phone" ? (
                        <CheckCheck className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
