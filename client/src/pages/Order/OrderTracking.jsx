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
  Home,
  CreditCard,
  ShoppingBag,
  Ship,
  Crown
} from "lucide-react";

function OrderTracking1() {
    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },[]);
  const { uuid } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [shippingData, setShippingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Updated to match your database ENUM values
  const orderStatuses = [
    { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
    { key: 'processing', label: 'Processing', description: 'We\'re preparing your items' },
    { key: 'completed', label: 'Completed', description: 'Order processing finished' }
  ];

  const deliveryStatuses = [
    { key: 'not_shipped', label: 'Not Shipped', description: 'Waiting to be shipped' },
    { key: 'in_transit', label: 'In Transit', description: 'Your order is on the way' },
    { key: 'delivered', label: 'Delivered', description: 'Order successfully delivered' }
  ];

  const paymentStatusConfig = {
    pending: { color: "bg-yellow-500", label: "Pending" },
    paid: { color: "bg-green-500", label: "Paid" },
    failed: { color: "bg-red-500", label: "Failed" },
    refunded: { color: "bg-blue-500", label: "Refunded" }
  };

  const orderStatusConfig = {
    pending: { color: "bg-yellow-500", label: "Pending" },
    processing: { color: "bg-blue-500", label: "Processing" },
    completed: { color: "bg-green-500", label: "Completed" },
    cancelled: { color: "bg-red-500", label: "Cancelled" }
  };

  const deliveryStatusConfig = {
    not_shipped: { color: "bg-gray-500", label: "Not Shipped" },
    in_transit: { color: "bg-purple-500", label: "In Transit" },
    delivered: { color: "bg-green-500", label: "Delivered" },
    returned: { color: "bg-orange-500", label: "Returned" }
  };

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

  const getStatusIndex = (status, statusArray) => {
    return statusArray.findIndex(s => s.key === status);
  };

  const getStatusColor = (currentIndex, targetIndex) => {
    if (currentIndex < targetIndex) return "bg-gray-200";
    if (currentIndex === targetIndex) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStatusIcon = (currentIndex, targetIndex) => {
    if (currentIndex < targetIndex) return <Clock className="h-5 w-5 text-gray-400" />;
    if (currentIndex === targetIndex) return <Package className="h-5 w-5 text-white" />;
    return <CheckCircle className="h-5 w-5 text-white" />;
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Loading Order Tracking</h2>
            <p className="text-gray-600">Fetching your order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <Package className="h-16 w-16 text-gray-400 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Order Not Found</h1>
            <p className="text-gray-600">Unable to find tracking information for this order.</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
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
  const currentOrderIndex = getStatusIndex(order.order_status, orderStatuses);
  const currentDeliveryIndex = getStatusIndex(order.delivery_status, deliveryStatuses);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Package className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Tracking</h1>
              <p className="text-xl text-gray-600">
                Tracking Order #<span className="font-mono font-semibold text-blue-600">{order.id}</span>
              </p>
            </div>
          </div>
          
          {/* Enhanced Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Order Status</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${orderStatusConfig[order.order_status]?.color || 'bg-gray-500'}`}></div>
                      <div className="font-semibold text-gray-900 capitalize">
                        {orderStatusConfig[order.order_status]?.label || order.order_status}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Ship className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Delivery Status</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${deliveryStatusConfig[order.delivery_status]?.color || 'bg-gray-500'}`}></div>
                      <div className="font-semibold text-gray-900 capitalize">
                        {deliveryStatusConfig[order.delivery_status]?.label || order.delivery_status}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Payment</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${paymentStatusConfig[order.payment_status]?.color || 'bg-gray-500'}`}></div>
                      <div className="font-semibold text-gray-900 capitalize">
                        {paymentStatusConfig[order.payment_status]?.label || order.payment_status}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={handleRefresh} 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tracking Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Progress */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {orderStatuses.map((status, index) => (
                    <div key={status.key} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          getStatusColor(currentOrderIndex, index)
                        } shadow-lg`}>
                          {getStatusIcon(currentOrderIndex, index)}
                        </div>
                        {index < orderStatuses.length - 1 && (
                          <div className={`flex-1 w-1 mt-3 transition-all duration-300 ${
                            currentOrderIndex > index ? 'bg-green-500' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-lg font-semibold transition-all duration-300 ${
                            currentOrderIndex >= index ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {status.label}
                          </h3>
                          {currentOrderIndex === index && (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                              Current
                            </span>
                          )}
                        </div>
                        <p className={`transition-all duration-300 ${
                          currentOrderIndex >= index ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {status.description}
                        </p>
                        {currentOrderIndex === index && order.updated_at && (
                          <p className="text-sm text-gray-500 mt-2">
                            Updated: {new Date(order.updated_at).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Progress */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                  <Truck className="h-6 w-6 text-purple-600" />
                  Delivery Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {deliveryStatuses.map((status, index) => (
                    <div key={status.key} className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                        currentDeliveryIndex >= index ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {currentDeliveryIndex > index ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`text-lg font-semibold transition-all duration-300 ${
                          currentDeliveryIndex >= index ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {status.label}
                        </span>
                        <p className={`text-sm transition-all duration-300 ${
                          currentDeliveryIndex >= index ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {status.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items with Shipping */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                  <Package className="h-6 w-6 text-orange-600" />
                  Order Summary ({items.length} {items.length === 1 ? 'Item' : 'Items'})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.quantity}`}
                      className="flex gap-4 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="font-semibold text-gray-900 ml-2">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold text-gray-900 ml-2">{formatPrice(item.price)}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold text-gray-900 ml-2">
                              {formatPrice(item.quantity * parseFloat(item.price))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Total & Shipping */}
                  <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600">Order Total:</span>
                      <span className="font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
                    </div>
                    
                    {/* Shipping Fee */}
                    {order.shipping_start && (
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-600">Shipping Fee(per 0.5 kg):</span>
                        <span className="font-bold text-gray-900">{formatPrice(order.shipping_start)}</span>
                      </div>
                    )}
                    
                    {/* Shipping Destination */}
                    {order.shipping_country && (
                      <div className="mt-4 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="flex items-center gap-3 mb-3">
                          <MapPin className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-gray-900">Shipping Destination</h4>
                        </div>
                        <div className="text-sm text-gray-700">
                          <div className="font-medium">{order.shipping_country} ({order.shipping_code})</div>
                          {order.shipping_start && (
                            <div className="mt-2 text-xs text-gray-600 bg-white/50 px-3 py-1 rounded-lg inline-block">
                              Starting from {formatPrice(order.shipping_start)}
                              {order.shipping_max && (
                                <span> up to {formatPrice(order.shipping_max)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Customer Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-bold text-gray-900">{customer.fname} {customer.lname}</div>
                      <div className="text-sm text-gray-600">Customer</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-xl">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-600">Email</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-xl">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{customer.phone}</div>
                      <div className="text-sm text-gray-600">Phone</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
                  <MapPin className="h-5 w-5 text-red-600" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {shipping ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl">
                      <Home className="h-5 w-5 text-red-600 mt-1" />
                      <div className="space-y-2">
                        <div className="font-bold text-gray-900">Delivery Address</div>
                        <div className="text-sm text-gray-700 space-y-1">
                          {shipping.street && <div className="font-medium">{shipping.street}</div>}
                          {shipping.house_number && <div>House: {shipping.house_number}</div>}
                          <div>
                            {shipping.city}
                            {shipping.sub_city && `, ${shipping.sub_city}`}
                          </div>
                          <div className="font-semibold">{shipping.country}</div>
                          {shipping.postal_code && <div>Postal Code: {shipping.postal_code}</div>}
                        </div>
                      </div>
                    </div>
                    
                    {shipping.phone_number && (
                      <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl">
                        <Phone className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-semibold text-gray-900">{shipping.phone_number}</div>
                          <div className="text-sm text-gray-600">Shipping Phone</div>
                        </div>
                      </div>
                    )}
                    
                    {shipping.additional_info && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm font-semibold text-gray-900 mb-2">Additional Info</div>
                        <div className="text-sm bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-gray-700">
                          {shipping.additional_info}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Shipping information not available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
                    <span className="text-gray-600">Order Placed</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(order.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-linear-to-r from-orange-50 to-red-50 rounded-xl">
                    <span className="text-gray-600">Estimated Delivery</span>
                    <span className="font-semibold text-blue-600">
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

function OrderTracking2() {
    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },[]);
  const { uuid } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [shippingData, setShippingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Updated to match your database ENUM values
  const orderStatuses = [
    { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
    { key: 'processing', label: 'Processing', description: 'We\'re preparing your items' },
    { key: 'completed', label: 'Completed', description: 'Order processing finished' }
  ];

  const deliveryStatuses = [
    { key: 'not_shipped', label: 'Not Shipped', description: 'Waiting to be shipped' },
    { key: 'in_transit', label: 'In Transit', description: 'Your order is on the way' },
    { key: 'delivered', label: 'Delivered', description: 'Order successfully delivered' }
  ];

  const paymentStatusConfig = {
    pending: { color: "bg-amber-400", label: "Pending" },
    paid: { color: "bg-emerald-500", label: "Paid" },
    failed: { color: "bg-rose-500", label: "Failed" },
    refunded: { color: "bg-slate-500", label: "Refunded" }
  };

  const orderStatusConfig = {
    pending: { color: "bg-amber-400", label: "Pending" },
    processing: { color: "bg-blue-500", label: "Processing" },
    completed: { color: "bg-emerald-500", label: "Completed" },
    cancelled: { color: "bg-rose-500", label: "Cancelled" }
  };

  const deliveryStatusConfig = {
    not_shipped: { color: "bg-slate-400", label: "Not Shipped" },
    in_transit: { color: "bg-purple-500", label: "In Transit" },
    delivered: { color: "bg-emerald-500", label: "Delivered" },
    returned: { color: "bg-amber-500", label: "Returned" }
  };

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

  const getStatusIndex = (status, statusArray) => {
    return statusArray.findIndex(s => s.key === status);
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

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Loading Order Tracking</h2>
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
            <h1 className="text-2xl font-bold mb-2 text-foreground">Order Not Found</h1>
            <p className="text-muted-foreground">Unable to find tracking information for this order.</p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
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
  const currentOrderIndex = getStatusIndex(order.order_status, orderStatuses);
  const currentDeliveryIndex = getStatusIndex(order.delivery_status, deliveryStatuses);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Luxury Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-linear-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg border border-border">
                <Crown className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-background shadow-sm">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground font-bungee tracking-tight">Order Tracking</h1>
              <p className="text-xl text-muted-foreground">
                Tracking Order <span className="font-mono font-semibold text-primary">#{order.id}</span>
              </p>
            </div>
          </div>
          
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground font-medium">Order Status</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${orderStatusConfig[order.order_status]?.color || 'bg-muted'}`}></div>
                      <div className="font-semibold text-foreground capitalize">
                        {orderStatusConfig[order.order_status]?.label || order.order_status}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Ship className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground font-medium">Delivery Status</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${deliveryStatusConfig[order.delivery_status]?.color || 'bg-muted'}`}></div>
                      <div className="font-semibold text-foreground capitalize">
                        {deliveryStatusConfig[order.delivery_status]?.label || order.delivery_status}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground font-medium">Payment</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${paymentStatusConfig[order.payment_status]?.color || 'bg-muted'}`}></div>
                      <div className="font-semibold text-foreground capitalize">
                        {paymentStatusConfig[order.payment_status]?.label || order.payment_status}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={handleRefresh} 
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm border border-border"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tracking Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Progress */}
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {orderStatuses.map((status, index) => (
                    <div key={status.key} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-border ${
                          getStatusColor(currentOrderIndex, index)
                        } shadow-sm`}>
                          {getStatusIcon(currentOrderIndex, index)}
                        </div>
                        {index < orderStatuses.length - 1 && (
                          <div className={`flex-1 w-0.5 mt-3 transition-all duration-300 ${
                            currentOrderIndex > index ? 'bg-primary' : 'bg-muted'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-lg font-semibold transition-all duration-300 ${
                            currentOrderIndex >= index ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {status.label}
                          </h3>
                          {currentOrderIndex === index && (
                            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium border border-border">
                              Current
                            </span>
                          )}
                        </div>
                        <p className={`transition-all duration-300 ${
                          currentOrderIndex >= index ? 'text-muted-foreground' : 'text-muted'
                        }`}>
                          {status.description}
                        </p>
                        {currentOrderIndex === index && order.updated_at && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Updated: {new Date(order.updated_at).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Progress */}
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
                  <Truck className="h-6 w-6 text-primary" />
                  Delivery Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {deliveryStatuses.map((status, index) => (
                    <div key={status.key} className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-border shadow-sm ${
                        currentDeliveryIndex >= index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {currentDeliveryIndex > index ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`text-lg font-semibold transition-all duration-300 ${
                          currentDeliveryIndex >= index ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {status.label}
                        </span>
                        <p className={`text-sm transition-all duration-300 ${
                          currentDeliveryIndex >= index ? 'text-muted-foreground' : 'text-muted'
                        }`}>
                          {status.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items with Shipping */}
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
                  <Package className="h-6 w-6 text-primary" />
                  Order Summary ({items.length} {items.length === 1 ? 'Item' : 'Items'})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.quantity}`}
                      className="flex gap-4 p-6 bg-secondary/50 rounded-xl border border-border"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm border border-border"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-lg mb-2">{item.name}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-semibold text-foreground ml-2">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold text-foreground ml-2">{formatPrice(item.price)}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-semibold text-foreground ml-2">
                              {formatPrice(item.quantity * parseFloat(item.price))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Total & Shipping */}
                  <div className="border-t border-border pt-6 mt-6 space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-muted-foreground">Order Total:</span>
                      <span className="font-bold text-foreground">{formatPrice(order.total_amount)}</span>
                    </div>
                    
                    {/* Shipping Fee */}
                    {order.shipping_start && (
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-muted-foreground">Shipping Fee:</span>
                        <span className="font-bold text-foreground">{formatPrice(order.shipping_start)}</span>
                      </div>
                    )}
                    
                    {/* Shipping Destination */}
                    {order.shipping_country && (
                      <div className="mt-4 p-4 bg-accent/20 rounded-xl border border-border">
                        <div className="flex items-center gap-3 mb-3">
                          <MapPin className="h-5 w-5 text-accent-foreground" />
                          <h4 className="font-semibold text-foreground">Shipping Destination</h4>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="font-medium text-foreground">{order.shipping_country} ({order.shipping_code})</div>
                          {order.shipping_start && (
                            <div className="mt-2 text-xs bg-background px-3 py-1 rounded-lg border border-border inline-block">
                              Starting from {formatPrice(order.shipping_start)}
                              {order.shipping_max && (
                                <span> up to {formatPrice(order.shipping_max)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Customer Information */}
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl border border-border">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-bold text-foreground">{customer.fname} {customer.lname}</div>
                      <div className="text-sm text-muted-foreground">Customer</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl border border-border">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-foreground">{customer.email}</div>
                      <div className="text-sm text-muted-foreground">Email</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl border border-border">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-foreground">{customer.phone}</div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {shipping ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl border border-border">
                      <Home className="h-5 w-5 text-primary mt-1" />
                      <div className="space-y-2">
                        <div className="font-bold text-foreground">Delivery Address</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {shipping.street && <div className="font-medium text-foreground">{shipping.street}</div>}
                          {shipping.house_number && <div>House: {shipping.house_number}</div>}
                          <div>
                            {shipping.city}
                            {shipping.sub_city && `, ${shipping.sub_city}`}
                          </div>
                          <div className="font-semibold text-foreground">{shipping.country}</div>
                          {shipping.postal_code && <div>Postal Code: {shipping.postal_code}</div>}
                        </div>
                      </div>
                    </div>
                    
                    {shipping.phone_number && (
                      <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl border border-border">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-semibold text-foreground">{shipping.phone_number}</div>
                          <div className="text-sm text-muted-foreground">Shipping Phone</div>
                        </div>
                      </div>
                    )}
                    
                    {shipping.additional_info && (
                      <div className="pt-4 border-t border-border">
                        <div className="text-sm font-semibold text-foreground mb-2">Additional Info</div>
                        <div className="text-sm bg-accent/20 p-4 rounded-xl border border-border text-muted-foreground">
                          {shipping.additional_info}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-muted" />
                    <p>Shipping information not available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl border border-border">
                    <span className="text-muted-foreground">Order Placed</span>
                    <span className="font-semibold text-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl border border-border">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-semibold text-foreground">
                      {new Date(order.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/20 rounded-xl border border-border">
                    <span className="text-muted-foreground">Estimated Delivery</span>
                    <span className="font-semibold text-primary">
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

export default OrderTracking2;