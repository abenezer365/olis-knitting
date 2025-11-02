import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit, LogOut, X } from "lucide-react";
import { toast } from "sonner";
import axios from "./../../../utils/axios.instance";
import { useGlobalContext } from "@/contexts/Context";
import { useLocation, useNavigate } from "react-router-dom";
import profilepic from "../../../assets/pp.png";

export default function Settings() {
   useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },[]);
  const [user, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");
  const { clearUser, setUser } = useGlobalContext();
  const navigate = useNavigate();

  const handleEdit = () => setIsEditing(true);
  const handleCloseModal = () => setIsEditing(false);
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const fetchUser = async () => {
    try {
      const res = await axios.get("/user/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(res.data.user);
      setFormData(res.data.user);
    } catch (error) {
      toast.error("Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const res = await axios.patch(
        "/user/edit",
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(res.data.user);

      await fetchUser();
      const res2 = await axios.get("/user/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res2.data.user)
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    }
    
  };

  const handleLogout = () => {
    navigate("/");
    clearUser();
    toast.success("Logged out successfully!");
  };
 console.log(user)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-muted-foreground animate-pulse">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-destructive">
        No user information found.
      </div>
    );
  }

  // Generate initials
  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen text-foreground flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full  bg-card  p-8 border border-border"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative mb-4">
            {
              user.role == "admin" ?
              <img src={profilepic} 
              alt="" 
              className="w-42 h-42 rounded-full border-muted"
              />
               :
              <div className="w-28 h-28 rounded-full text-white bg-accent flex items-center justify-center text-5xl font-black shadow-md select-none">
                {initials}
              </div>

            }
          </div>
          <h2 className="text-3xl font-bold font-bungee tracking-wide">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-muted-foreground">{user.email}</p>
          <p
            className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              user.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.status === "active" ? "Active User" : "Inactive"}
          </p>
        </div>

        {/* Info Section */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <InfoCard label="Phone" value={user.phone || "N/A"} />
          <InfoCard
            label="Role"
            value={user.role.charAt(0).toUpperCase()+ user.role.slice(1)}
          />
            <InfoCard
            label="Joined"
            value={new Date(user.created_at).toLocaleDateString()}
          />
          <InfoCard
            label="Last Updated"
            value={new Date(user.updated_at).toLocaleDateString()}
          />
          <InfoCard
            label="Account ID"
            value={`#${user.id.toString().padStart(4, "0")}`}
          />
          
          <InfoCard
            label="UUID"
            value={user.uuid}
          />
        
          
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={handleEdit}
            className="bg-accent/60 text-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-accent transition-all duration-300 shadow-sm"
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-destructive/70 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-destructive transition-all duration-300 shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md p-6 rounded-xl shadow-xl border border-border relative"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-semibold mb-4 text-center font-bungee">
                Edit Profile
              </h3>
              <div className="space-y-3">
                <InputField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
                <InputField
                  label="Phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
                
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== Reusable Components ===== */
const InfoCard = ({ label, value }) => (
  <div className="bg-muted/50 p-4 rounded-xl border border-border flex flex-col justify-between shadow-sm hover:shadow transition-all">
    <span className="text-muted-foreground text-xs uppercase tracking-wider">
      {label}
    </span>
    <span className="text-base font-semibold mt-1">{value}</span>
  </div>
);

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-1">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-border rounded-md bg-input px-3 py-2 focus:ring-2 focus:ring-ring outline-none"
    />
  </div>
);
