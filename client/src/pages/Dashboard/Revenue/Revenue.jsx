import React, { useEffect, useState } from "react";
import axios from "@/utils/axios.instance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

const Revenue = () => {
    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },[]);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token")
  // Fetch revenue from backend
  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/revenue/revenue", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRevenueData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await axios.post("/revenue/revenue",{},{
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchRevenue(); // Refresh data after updating
      toast.success("Revenue data refreshed succesfully")
    } catch (err) {
      toast.error("Unable to refresh revenue data")
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  if (loading || !revenueData)
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading revenue data...
      </div>
    );

  // Prepare data for Recharts
  const monthlyTrendEntries = Object.entries(revenueData.monthly_trend || {});
  const chartData = monthlyTrendEntries.map(([month, value]) => ({
    month,
    revenue: parseFloat(value),
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="text-3xl font-bold text-primary">Revenue Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Financial performance overview
        </p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-3xl">💰</div>
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(revenueData.total_revenue)}</p>
              <p className="text-green-600 text-sm mt-1">
                ↑ {((revenueData.month_revenue / (revenueData.previous_month_revenue || 1) - 1) * 100).toFixed(2)}% this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📈</div>
            <div>
              <p className="text-muted-foreground text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(revenueData.month_revenue)}</p>
              <p className="text-green-600 text-sm mt-1">
                {revenueData.previous_month_revenue > 0
                  ? `↑ ${((revenueData.month_revenue / revenueData.previous_month_revenue - 1) * 100).toFixed(2)}% vs last month`
                  : "New month"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🛒</div>
            <div>
              <p className="text-muted-foreground text-sm">Weekly Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(revenueData.week_revenue)}</p>
              <p className="text-green-600 text-sm mt-1">This week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="bg-accent text-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition"
        >
          {updating ? "Updating..." : "Update Revenue"}
        </button>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-5">Monthly Revenue Trend</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
              <YAxis tickFormatter={(value) => `$${value}`} tick={{ fill: "#6b7280" }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill="#d4c5b0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-center">No monthly trend data yet.</p>
        )}
      </div>
    </div>
  );
};

export default Revenue;
