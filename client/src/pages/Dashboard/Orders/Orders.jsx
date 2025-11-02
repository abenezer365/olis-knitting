import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "@/utils/axios.instance";
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Truck,
  CreditCard,
  User,
  Calendar,
  ArrowUpDown,
  ExternalLink
} from "lucide-react";

function Orders() {
    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },[]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ quantity: 1, unit_price: 0, total_amount: 0 });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/order/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders || response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.customer_fname?.toLowerCase().includes(searchLower) ||
      order.customer_lname?.toLowerCase().includes(searchLower) ||
      order.customer_email?.toLowerCase().includes(searchLower) ||
      order.id?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.order_status?.toLowerCase() === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.payment_status?.toLowerCase() === paymentFilter;
    const matchesDelivery = deliveryFilter === "all" || order.delivery_status?.toLowerCase() === deliveryFilter;
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDelivery;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusUpdate = async (type, value, order) => {
    try {
      let endpoint = "";
      switch (type) {
        case "order_status": endpoint = `/order/edit/order_status/${order.id}`; break;
        case "payment_status": endpoint = `/order/edit/payment_status/${order.id}`; break;
        case "delivery_status": endpoint = `/order/edit/delivery_status/${order.id}`; break;
        default: return;
      }
      
      await axios.patch(endpoint, { [type]: value }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success(`Order ${type.replace('_', ' ')} updated`);
      fetchOrders();
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast.error(`Failed to update ${type.replace('_', ' ')}`);
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditForm({
      quantity: 1,
      unit_price: parseFloat(order.total_amount),
      total_amount: parseFloat(order.total_amount)
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const newTotal = (editForm.quantity * editForm.unit_price).toFixed(2);
      await axios.patch(`/order/update/${selectedOrder.id}`, {
        quantity: editForm.quantity,
        total_amount: newTotal
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success("Order updated successfully");
      setEditModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const confirmDelete = async () => {
    try {  
      await axios.delete(`/order/delete/${selectedOrder.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order deleted successfully");
      setDeleteModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const updateEditForm = (field, value) => {
    const newForm = { ...editForm, [field]: value };
    if (field === "quantity" || field === "unit_price") {
      newForm.total_amount = (newForm.quantity * newForm.unit_price).toFixed(2);
    }
    setEditForm(newForm);
  };

  const handleTrackOrder = (order) => {
    window.open(`/order/${order.uuid}`, '_blank');
  };

  const getStatusColor = (status, type) => {
    const statusLower = status?.toLowerCase();
    
    if (type === 'order') {
      switch (statusLower) {
        case 'completed': return 'bg-green-100 text-green-800 border-green-200';
        case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else if (type === 'payment') {
      switch (statusLower) {
        case 'paid': return 'bg-green-100 text-green-800 border-green-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'failed': return 'bg-red-100 text-red-800 border-red-200';
        case 'refunded': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else if (type === 'delivery') {
      switch (statusLower) {
        case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
        case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'not_shipped': return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'returned': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>

        {/* Filters Card */}
        <div className="bg-card rounded-xl border border-accent/20 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search orders by customer, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
              />
            </div>
            
            {/* Order Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 appearance-none cursor-pointer"
              >
                <option value="all">All Order Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <select 
                value={paymentFilter} 
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 appearance-none cursor-pointer"
              >
                <option value="all">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Delivery Status Filter */}
            <div className="relative">
              <Truck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <select 
                value={deliveryFilter} 
                onChange={(e) => setDeliveryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 appearance-none cursor-pointer"
              >
                <option value="all">All Delivery Status</option>
                <option value="not_shipped">Not Shipped</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-4">
          {paginatedOrders.map((order) => (
            <div key={order.id} className="bg-card rounded-xl border border-accent/20 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.uuid}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.order_status, 'order')}`}>
                        {order.order_status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.payment_status, 'payment')}`}>
                        {order.payment_status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.delivery_status, 'delivery')}`}>
                        {order.delivery_status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer_fname} {order.customer_lname}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatCurrency(parseFloat(order.total_amount))}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTrackOrder(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Track
                  </button>
                  <button
                    onClick={() => handleEdit(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => { setSelectedOrder(order); setDeleteModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Quick Status Update */}
              <div className="mt-4 pt-4 border-t border-accent/20">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Order:</span>
                    <select 
                      value={order.order_status} 
                      onChange={(e) => handleStatusUpdate("order_status", e.target.value, order)}
                      className="text-sm border border-accent/20 rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-accent/30"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Payment:</span>
                    <select 
                      value={order.payment_status} 
                      onChange={(e) => handleStatusUpdate("payment_status", e.target.value, order)}
                      className="text-sm border border-accent/20 rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-accent/30"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Delivery:</span>
                    <select 
                      value={order.delivery_status} 
                      onChange={(e) => handleStatusUpdate("delivery_status", e.target.value, order)}
                      className="text-sm border border-accent/20 rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-accent/30"
                    >
                      <option value="not_shipped">Not Shipped</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="returned">Returned</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === page 
                        ? 'bg-accent text-accent-foreground' 
                        : 'border border-accent/20 hover:bg-accent/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" || paymentFilter !== "all" || deliveryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No orders have been placed yet"
              }
            </p>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl border border-accent/20 p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Order #{selectedOrder?.id}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.quantity}
                    onChange={(e) => updateEditForm("quantity", parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.unit_price}
                    onChange={(e) => updateEditForm("unit_price", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-accent/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Amount</label>
                  <input
                    value={formatCurrency(editForm.total_amount)}
                    disabled
                    className="w-full p-3 border border-accent/20 rounded-lg bg-muted/50 font-semibold"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-3 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl border border-accent/20 p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Order</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete order <strong>#{selectedOrder?.id}</strong> for{" "}
                <strong>{selectedOrder?.customer_fname} {selectedOrder?.customer_lname}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-3 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;