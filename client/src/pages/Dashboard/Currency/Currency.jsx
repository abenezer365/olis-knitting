import { useEffect, useState } from "react";
import axios from "@/utils/axios.instance";
import { Loader2, TrendingUp, TrendingDown, ArrowRight, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";

const Currency = () => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [rateHistory, setRateHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newRate, setNewRate] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token")

  const fetchData = async () => {
    try {

      setLoading(true);
      const rateRes = await axios.get('/currency/rate',{
        headers: { Authorization: `Bearer ${token}` },
      })
       const historyRes = await axios.get('/currency/getRateHistory', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setExchangeRate(rateRes.data);
      setRateHistory(historyRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load currency data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },[]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleRateUpdate = async (e) => {
    e.preventDefault();
    if (!newRate || !changeReason) return;
    try {
      setSubmitting(true);
      await axios.patch("/currency/updateRate", {
        current_rate: parseFloat(newRate),
        reason: changeReason,
      },{
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Exchange rate updated successfully!");
      setNewRate("");
      setChangeReason("");
      setShowUpdateForm(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to update rate.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTrendIcon = (change) => {
    if (parseFloat(change) > 0) return <TrendingUp className="w-4 h-4 text-green-600 inline" />;
    if (parseFloat(change) < 0) return <TrendingDown className="w-4 h-4 text-red-600 inline" />;
    return <ArrowRight className="w-4 h-4 text-gray-500 inline" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading currency data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans space-y-8 text-foreground">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Currency Exchange Rate</h1>
        <p className="text-muted-foreground text-sm">
          USD to Ethiopian Birr (ETB) Management
        </p>
      </header>

      {/* Current Rate */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇺🇸</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-violet-200">USD</span>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl">🇪🇹</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-200">ETB</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold tracking-tight">
              1 USD = {exchangeRate?.rate} ETB
            </p>
          </div>

          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            {showUpdateForm ? <X size={16} /> : <PlusCircle size={16} />}
            {showUpdateForm ? "Cancel Update" : "Update Rate"}
          </button>
        </div>
      </div>

      {/* Update Form */}
      {showUpdateForm && (
        <form
          onSubmit={handleRateUpdate}
          className="bg-background/30 border border-border rounded-lg p-6 space-y-4"
        >
          <h3 className="font-semibold text-lg mb-2">Update Exchange Rate</h3>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              New Rate (ETB)
            </label>
            <input
              type="number"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="w-full border border-border rounded-md p-2 bg-input text-foreground focus:ring-2 focus:ring-ring outline-none"
              placeholder="Enter new rate..."
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Reason for Change
            </label>
            <select
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              className="w-full border border-border rounded-md p-2 bg-input text-foreground"
              required
            >
              <option value="">Select reason...</option>
              <option value="Market adjustment">Market adjustment</option>
              <option value="Central bank update">Central bank update</option>
              <option value="Inflation update">Inflation update</option>
              <option value="Market stabilization">Market stabilization</option>
              <option value="Weekly adjustment">Weekly adjustment</option>
              <option value="Economic factors">Economic factors</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground w-full py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            {submitting ? "Updating..." : "Update Exchange Rate"}
          </button>
        </form>
      )}

      {/* History */}
      <section className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Exchange Rate History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Rate</th>
                <th className="text-left p-2">Change</th>
                <th className="text-left p-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {rateHistory.map((record, i) => (
                <tr
                  key={i}
                  className="border-b border-border hover:bg-secondary transition"
                >
                  <td className="p-2">{record.date}</td>
                  <td className="p-2">{record.rate}</td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(record.change) > 0
                          ? "bg-green-100 text-green-700"
                          : parseFloat(record.change) < 0
                          ? "bg-red-100 text-red-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {getTrendIcon(record.change)} {record.change}
                    </span>
                  </td>
                  <td className="p-2">{record.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Currency;
