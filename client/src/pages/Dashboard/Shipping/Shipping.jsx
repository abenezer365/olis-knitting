import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "@/utils/axios.instance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus,
  Globe,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function ShippingFeeManagement() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  
  const [shippingFees, setShippingFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedShippingFee, setSelectedShippingFee] = useState(null);
  
  const [editForm, setEditForm] = useState({
    country_name: "",
    country_code: "",
    starting_price: "",
    maximum_price: ""
  });
  
  const [createForm, setCreateForm] = useState({
    country_name: "",
    country_code: "",
    starting_price: "",
    maximum_price: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchShippingFees();
  }, []);

  const fetchShippingFees = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/shippingFee/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShippingFees(response.data || []);
    } catch (error) {
      console.error("Error fetching shipping fees:", error);
      toast.error("Failed to load shipping fees");
    } finally {
      setLoading(false);
    }
  };

  const filteredShippingFees = shippingFees.filter((fee) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      fee.country_name?.toLowerCase().includes(searchLower) ||
      fee.country_code?.toLowerCase().includes(searchLower);
    
    if (priceFilter === "low") {
      return parseFloat(fee.starting_price) < 20;
    } else if (priceFilter === "medium") {
      return parseFloat(fee.starting_price) >= 20 && parseFloat(fee.starting_price) < 50;
    } else if (priceFilter === "high") {
      return parseFloat(fee.starting_price) >= 50;
    }
    
    return matchesSearch;
  });

  const handleEdit = (fee) => {
    setSelectedShippingFee(fee);
    setEditForm({
      country_name: fee.country_name || "",
      country_code: fee.country_code || "",
      starting_price: fee.starting_price || "",
      maximum_price: fee.maximum_price || ""
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.patch(`/shippingFee/${selectedShippingFee.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Shipping fee updated successfully");
      setEditModalOpen(false);
      fetchShippingFees();
    } catch (error) {
      console.error("Error updating shipping fee:", error);
      toast.error("Failed to update shipping fee");
    }
  };

  const handleCreate = async () => {
    try {
      // Convert prices to numbers
      const payload = {
        ...createForm,
        starting_price: parseFloat(createForm.starting_price),
        maximum_price: parseFloat(createForm.maximum_price)
      };
      
      await axios.post("/shippingFee/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Shipping fee created successfully");
      setCreateModalOpen(false);
      setCreateForm({
        country_name: "",
        country_code: "",
        starting_price: "",
        maximum_price: ""
      });
      fetchShippingFees();
    } catch (error) {
      console.log("Error creating shipping fee:", error);
      toast.error("Failed to create shipping fee");
    }
  };

  const handleDelete = (fee) => {
    setSelectedShippingFee(fee);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {  
      await axios.delete(`/shippingFee/${selectedShippingFee.id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success("Shipping fee deleted successfully");
      setDeleteModalOpen(false);
      fetchShippingFees();
    } catch (error) {
      console.error("Error deleting shipping fee:", error);
      
      if (error.response?.status === 403) {
        toast.error("You don't have permission to delete shipping fees");
      } else if (error.response?.status === 401) {
        toast.error("Please log in again");
      } else {
        toast.error("Failed to delete shipping fee");
      }
    }
  };

  const getPriceRangeVariant = (startingPrice) => {
    const price = parseFloat(startingPrice);
    if (price < 20) return "low";
    if (price >= 20 && price < 50) return "medium";
    return "high";
  };

  const getPriceRangeBadge = (startingPrice) => {
    const variant = getPriceRangeVariant(startingPrice);
    const variants = {
      low: { label: "Low Cost", variant: "active" },
      medium: { label: "Medium Cost", variant: "default" },
      high: { label: "High Cost", variant: "destructive" }
    };
    
    return variants[variant] || { label: "Unknown", variant: "outline" };
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige-600 mx-auto"></div>
          <p className="text-beige-700">Loading shipping fees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-beige-900 flex items-center gap-3">
              <Globe className="h-8 w-8" />
              Shipping Fee Management
            </h1>
            <p className="text-beige-600 mt-2">
              Manage shipping costs and delivery rates across different countries
            </p>
          </div>
          <Button 
            onClick={() => setCreateModalOpen(true)} 
            className="gap-2 bg-accent hover:bg-beige-700 text-black"
          >
            <Plus className="h-4 w-4" />
            Add Shipping Fee
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-beige-500" />
            <Input
              placeholder="Search by country name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-beige-200 focus:border-beige-400"
            />
          </div>
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="bg-white border-beige-200">
              <DollarSign className="h-4 w-4 mr-2 text-beige-500" />
              <SelectValue placeholder="Filter by price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Price Ranges</SelectItem>
              <SelectItem value="low">Low ($0 - $20)</SelectItem>
              <SelectItem value="medium">Medium ($20 - $50)</SelectItem>
              <SelectItem value="high">High ($50+)</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-end">
            <Badge variant="outline" className="bg-beige-100 text-beige-800">
              {filteredShippingFees.length} countries
            </Badge>
          </div>
        </div>

        {/* Shipping Fees Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredShippingFees.map((fee) => {
            const priceBadge = getPriceRangeBadge(fee.starting_price);
            return (
              <Card key={fee.id} className="hover:shadow-lg transition-all duration-300 border-accent bg-background group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-beige-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-beige-600" />
                        {fee.country_name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 bg-beige-50 text-beige-700">
                        {fee.country_code}
                      </Badge>
                    </div>
                    <Badge variant={priceBadge.variant} className="ml-2">
                      {priceBadge.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-beige-600 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Starting Price:
                      </span>
                      <span className="font-semibold text-beige-900">
                        {formatPrice(fee.starting_price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-beige-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Maximum Price:
                      </span>
                      <span className="font-semibold text-beige-900">
                        {formatPrice(fee.maximum_price)}
                      </span>
                    </div>
                  </div>

                  {/* Date Info */}
                  {fee.created_at && (
                    <div className="pt-2 border-t border-beige-100">
                      <div className="flex items-center gap-1 text-xs text-beige-500">
                        <Calendar className="h-3 w-3" />
                        Updated {new Date(fee.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(fee)}
                      className="flex-1 border-beige-300 text-beige-700 hover:bg-beige-50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(fee)}
                      className="flex-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredShippingFees.length === 0 && (
          <Card className="border-beige-200 bg-white">
            <CardContent className="p-12 text-center">
              <Globe className="h-16 w-16 text-beige-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-beige-800 mb-2">
                {searchTerm || priceFilter !== "all" 
                  ? "No shipping fees found"
                  : "No shipping fees configured"
                }
              </h3>
              <p className="text-beige-600 mb-6">
                {searchTerm || priceFilter !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first shipping fee"
                }
              </p>
              <Button 
                onClick={() => setCreateModalOpen(true)} 
                className="gap-2 bg-beige-600 hover:bg-beige-700 text-white"
              >
                <Plus className="h-4 w-4" />
                Add First Shipping Fee
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="bg-white border-beige-200">
            <DialogHeader>
              <DialogTitle className="text-beige-900">Edit Shipping Fee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-beige-700">Country Name</Label>
                <Input
                  value={editForm.country_name}
                  onChange={(e) => setEditForm({...editForm, country_name: e.target.value})}
                  className="border-beige-300 focus:border-beige-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-beige-700">Country Code</Label>
                <Input
                  value={editForm.country_code}
                  onChange={(e) => setEditForm({...editForm, country_code: e.target.value.toUpperCase()})}
                  className="border-beige-300 focus:border-beige-500 uppercase"
                  maxLength={3}
                  placeholder="US, UK, CA, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-beige-700">Starting Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.starting_price}
                    onChange={(e) => setEditForm({...editForm, starting_price: e.target.value})}
                    className="border-beige-300 focus:border-beige-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-beige-700">Maximum Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.maximum_price}
                    onChange={(e) => setEditForm({...editForm, maximum_price: e.target.value})}
                    className="border-beige-300 focus:border-beige-500"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setEditModalOpen(false)}
                className="border-beige-300 text-beige-700 hover:bg-beige-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEdit}
                className="bg-accent hover:bg-beige-700 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="bg-white border-beige-200">
            <DialogHeader>
              <DialogTitle className="text-beige-900">Add New Shipping Fee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-beige-700">Country Name *</Label>
                <Input
                  value={createForm.country_name}
                  onChange={(e) => setCreateForm({...createForm, country_name: e.target.value})}
                  className="border-beige-300 focus:border-beige-500"
                  placeholder="United States"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-beige-700">Country Code *</Label>
                <Input
                  value={createForm.country_code}
                  onChange={(e) => setCreateForm({...createForm, country_code: e.target.value.toUpperCase()})}
                  className="border-beige-300 focus:border-beige-500 uppercase"
                  maxLength={3}
                  placeholder="US"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-beige-700">Starting Price ($) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={createForm.starting_price}
                    onChange={(e) => setCreateForm({...createForm, starting_price: e.target.value})}
                    className="border-beige-300 focus:border-beige-500"
                    placeholder="13.45"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-beige-700">Maximum Price ($) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={createForm.maximum_price}
                    onChange={(e) => setCreateForm({...createForm, maximum_price: e.target.value})}
                    className="border-beige-300 focus:border-beige-500"
                    placeholder="24.82"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setCreateModalOpen(false)}
                className="border-beige-600 text-beige-700 hover:bg-beige-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                className="bg-accent hover:bg-beige-700 text-black"
              >
                Create Shipping Fee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="bg-white border-beige-200">
            <DialogHeader>
              <DialogTitle className="text-beige-900">Delete Shipping Fee</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-beige-700">
                Are you sure you want to delete the shipping fee for{" "}
                <strong>{selectedShippingFee?.country_name}</strong>?
                This action cannot be undone and will affect shipping calculations for this country.
              </p>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDeleteModalOpen(false)}
                className="border-beige-300 text-beige-700 hover:bg-beige-50"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
              >
                Delete Shipping Fee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default ShippingFeeManagement;