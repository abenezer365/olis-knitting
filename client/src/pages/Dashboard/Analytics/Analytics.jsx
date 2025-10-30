import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import axios from "@/utils/axios.instance"; // assuming you have this setup
import { Link } from "react-router-dom";

const COLORS = ["#A67C52", "#D6B893", "#EBDDC7", "#BFA98E", "#8B6E4B"];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---- Fetch Analytics Data ----
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/analytics/analytics");
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  // ---- Update Analytics ----
  const refreshAnalytics = async () => {
    try {
      setLoading(true);
      await axios.post("/analytics/analytics");
      toast.success("Analytics updated successfully");
      await fetchAnalytics();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!analytics)
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground animate-pulse">
        Loading analytics...
      </div>
    );

  const stats = [
    { label: "Customers", value: analytics.total_customers, color: "#1C2428", path: "customers" },
    { label: "Products in Stock", value: analytics.total_products, color: "#A67C52", path: "products" },
    { label: "Total Orders", value: analytics.total_orders, color: "#D6C6B8", path: "orders" },
    { label: "Revenue", value: `$${analytics.total_revenue}`, color: "#F5DEB3", path: "revenue" },
  ];

  const salesData = analytics.sales_data || [];
  const revenueData = analytics.revenue_data || [];

  return (
    <div className="p-6 w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Business Analytics</h1>
        <button
          onClick={refreshAnalytics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-foreground rounded-lg hover:opacity-90 transition disabled:opacity-60"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <Link
            key={idx}
            to={`/dashboard/${stat.path}`}
            className="p-5 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition group"
          >
            <h2 className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </h2>
            <p className="text-muted-foreground mt-2 group-hover:text-foreground transition">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-5 text-foreground">Top Selling Products</h2>
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="productName" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: "10px" }} />
                <Bar dataKey="sales" fill="#EED5B7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No sales data available</p>
          )}
        </div>

        {/* Revenue Pie Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-5 text-foreground">Revenue by Category</h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                  }}
                  formatter={(val) => `$${Number(val).toLocaleString()}`}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No revenue data available</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-muted-foreground text-center mt-4">
        Last updated: {new Date(analytics.updated_at).toLocaleString()}
      </div>
    </div>
  );
}
