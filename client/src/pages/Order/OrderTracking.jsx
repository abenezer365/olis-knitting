import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "@/utils/axios.instance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  User, 
  MapPin, 
  RefreshCw,
  Phone,
  Mail,
  Home
} from "lucide-react";

function OrderTracking() {
  const { uuid } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [shippingData, setShippingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const orderStatuses = [
    { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
    { key: 'confirmed', label: 'Order Confirmed', description: 'We\'re preparing your items' },
    { key: 'processing', label: 'Processing', description: 'Items are being packaged' },
    { key: 'shipped', label: 'Shipped', description: 'Your order is on the way' },
    { key: 'delivered', label: 'Delivered', description: 'Order successfully delivered' }
  ];

  const deliveryStatuses = [
    { key: 'not_shipped', label: 'Not Shipped' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  useEffect(() => {
    fetchOrderData();
  }, [uuid]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const [orderResponse, shippingResponse] = await Promise.all([
        axios.get(`/order/get_by_uuid/${uuid}`),
        axios.get(`/shipping/getShipping/${uuid}`)
      ]);
      
      setOrderData(orderResponse.data);
      setShippingData(shippingResponse.data);
    } catch (error) {
      console.error("Error fetching order data:", error);
      toast.error("Failed to load order tracking information");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrderData();
  };

  const getStatusIndex = (status) => {
    return orderStatuses.findIndex(s => s.key === status) || 0;
  };

  const getDeliveryStatusIndex = (status) => {
    return deliveryStatuses.findIndex(s => s.key === status) || 0;
  };

  const getStatusColor = (currentIndex, targetIndex) => {
    if (currentIndex < targetIndex) return "bg-muted";
    if (currentIndex === targetIndex) return "bg-accent";
    return "bg-primary";
  };

  const getStatusIcon = (currentIndex, targetIndex) => {
    if (currentIndex < targetIndex) return <Clock className="h-5 w-5 text-muted-foreground" />;
    if (currentIndex === targetIndex) return <Package className="h-5 w-5 text-accent-foreground" />;
    return <CheckCircle className="h-5 w-5 text-primary-foreground" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div>
            <h2 className="text-xl font-semibold">Loading Order Tracking</h2>
            <p className="text-muted-foreground">Fetching your order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <Package className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground">Unable to find tracking information for this order.</p>
          </div>
          <Button asChild>
            <a href="/products">Continue Shopping</a>
          </Button>
        </div>
      </div>
    );
  }

  const order = orderData;
  const customer = orderData.client || {};
  const items = orderData.products || [];
  const shipping = shippingData?.shipping || {};
  const currentStatusIndex = getStatusIndex(order.order_status);
  const currentDeliveryIndex = getDeliveryStatusIndex(order.delivery_status);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold mb-2">Order Tracking</h1>
              <p className="text-xl text-muted-foreground">
                Order #<span className="font-mono font-semibold">{order.id}</span>
              </p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-card px-4 py-2 rounded-lg border">
              <div className="text-sm text-muted-foreground">Order Status</div>
              <div className="font-semibold capitalize">{order.order_status?.replace('_', ' ')}</div>
            </div>
            <div className="bg-card px-4 py-2 rounded-lg border">
              <div className="text-sm text-muted-foreground">Delivery Status</div>
              <div className="font-semibold capitalize">{order.delivery_status?.replace('_', ' ')}</div>
            </div>
            <div className="bg-card px-4 py-2 rounded-lg border">
              <div className="text-sm text-muted-foreground">Payment</div>
              <div className="font-semibold capitalize">{order.payment_status}</div>
            </div>
          </div>

          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tracking Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Progress */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Truck className="h-5 w-5" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderStatuses.map((status, index) => (
                    <div key={status.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(currentStatusIndex, index)}`}>
                          {getStatusIcon(currentStatusIndex, index)}
                        </div>
                        {index < orderStatuses.length - 1 && (
                          <div className={`flex-1 w-0.5 mt-2 ${currentStatusIndex > index ? 'bg-primary' : 'bg-muted'}`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${
                            currentStatusIndex >= index ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {status.label}
                          </h3>
                          {currentStatusIndex === index && (
                            <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{status.description}</p>
                        {currentStatusIndex === index && order.updated_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Updated: {new Date(order.updated_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Progress */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Truck className="h-5 w-5" />
                  Delivery Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryStatuses.map((status, index) => (
                    <div key={status.key} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentDeliveryIndex >= index ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {currentDeliveryIndex > index ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${
                          currentDeliveryIndex >= index ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="h-5 w-5" />
                  Order Items ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.quantity}`}
                      className="flex gap-4 p-4 bg-secondary/30 rounded-lg border"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{item.name}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-medium ml-2">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium ml-2">${parseFloat(item.price).toFixed(2)}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-medium ml-2">
                              ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount:</span>
                      <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Customer & Shipping Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{customer.fname} {customer.lname}</div>
                      <div className="text-sm text-muted-foreground">Customer</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{customer.email}</div>
                      <div className="text-sm text-muted-foreground">Email</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{customer.phone}</div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {shipping ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Home className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="space-y-1">
                        <div className="font-semibold">Delivery Address</div>
                        <div className="text-sm">
                          {shipping.street && <div>{shipping.street}</div>}
                          {shipping.house_number && <div>House: {shipping.house_number}</div>}
                          <div>
                            {shipping.city}
                            {shipping.sub_city && `, ${shipping.sub_city}`}
                          </div>
                          <div>{shipping.country}</div>
                          {shipping.postal_code && <div>Postal Code: {shipping.postal_code}</div>}
                        </div>
                      </div>
                    </div>
                    
                    {shipping.phone_number && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{shipping.phone_number}</div>
                          <div className="text-sm text-muted-foreground">Shipping Phone</div>
                        </div>
                      </div>
                    )}
                    
                    {shipping.additional_info && (
                      <div className="pt-3 border-t">
                        <div className="text-sm text-muted-foreground mb-1">Additional Info</div>
                        <div className="text-sm bg-secondary/30 p-3 rounded-lg">
                          {shipping.additional_info}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p>Shipping information not available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Order Placed</span>
                    <span className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">
                      {new Date(order.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estimated Delivery</span>
                    <span className="font-medium text-accent">
                      {new Date(new Date(order.created_at).setDate(new Date(order.created_at).getDate() + 7)).toLocaleDateString()}
                    </span>
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

export default OrderTracking;