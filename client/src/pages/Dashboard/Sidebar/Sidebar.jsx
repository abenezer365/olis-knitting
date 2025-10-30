import React from "react";
import CSS from "./Sidebar.module.css";
import { FaHome } from "react-icons/fa";
import { IoNewspaper } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { RiCustomerServiceFill } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom"; // ⬅️ added useLocation
import { FaRegMessage } from "react-icons/fa6";
import profilepic from "../../../assets/pp.png";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { FaMoneyBillAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useGlobalContext } from "@/contexts/Context";

function Sidebar() {
  const location = useLocation();
  const {user} = useGlobalContext()
  const role = user.role;
  const isActive = (path) =>
    location.pathname === path
      ? "bg-muted text-primary"
      : "";
  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();
  return (
    <div className={CSS.sidebar}>
      <div className={CSS.profile}>
        {
          role == "admin" ? 
          <img src={profilepic} alt="Admin Logo" className="w-22 h-22 rounded-full border-muted-200 border-2"/>
          :
          <div className="w-20 h-20 rounded-full text-foreground bg-accent flex items-center justify-center text-3xl font-black shadow-md select-none">{initials}</div>
        }
        <p className={CSS.pp_title}>{`${user.first_name} ${user.last_name}`}</p>
        <p className={CSS.pp_subtitle}>{user.email}</p>
        <p className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground my-2">
          {role === "admin"
            ? "ADMIN"
            : role === "manager"
            ? "MANAGER"
            : role === "employee"
            ? "EMPLOYEE"
            : "MR. X"}
        </p>
      </div>
      <div className={CSS.routes}>
        <Link to="/dashboard/">
          <div
            className={`${CSS.single} ${isActive("/dashboard/")} transition-colors duration-200`}
          >
            <FaHome />
            <p>Dashboard</p>
          </div>
        </Link>

        <Link to="/dashboard/orders">
          <div
            className={`${CSS.single} ${isActive("/dashboard/orders")} transition-colors duration-200`}
          >
            <IoNewspaper />
            <p>Orders</p>
          </div>
        </Link>

        <Link to="/dashboard/customers">
          <div
            className={`${CSS.single} ${isActive("/dashboard/customers")} transition-colors duration-200`}
          >
            <RiCustomerServiceFill />
            <p>Customers</p>
          </div>
        </Link>

        <Link to="/dashboard/products">
          <div
            className={`${CSS.single} ${isActive("/dashboard/products")} transition-colors duration-200`}
          >
            <AiOutlineProduct />
            <p>Products</p>
          </div>
        </Link>

        <Link to="/dashboard/revenue">
          <div
            className={`${CSS.single} ${isActive("/dashboard/revenue")} transition-colors duration-200`}
          >
            <FaMoneyCheckDollar />
            <p>Revenue</p>
          </div>
        </Link>

        <Link to="/dashboard/messages">
          <div
            className={`${CSS.single} ${isActive("/dashboard/messages")} transition-colors duration-200`}
          >
            <FaRegMessage />
            <p>Messages</p>
          </div>
        </Link>

        <Link to="/dashboard/currency">
          <div
            className={`${CSS.single} ${isActive("/dashboard/currency")} transition-colors duration-200`}
          >
            <FaMoneyBillAlt />
            <p>Currency Rate</p>
          </div>
        </Link>
        <Link to="/dashboard/staff">
          <div
            className={`${CSS.single} ${isActive("/dashboard/staff")} transition-colors duration-200`}
          >
            <FaUsers />
            <p>Staff</p>
          </div>
        </Link>
                <Link to="/dashboard/setting">
          <div
            className={`${CSS.single} ${isActive("/dashboard/setting")} transition-colors duration-200`}
          >
            <IoMdSettings />
            <p>Setting</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
