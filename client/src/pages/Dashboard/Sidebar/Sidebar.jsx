import React from "react";
import { FaHome } from "react-icons/fa";
import { IoNewspaper } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { RiCustomerServiceFill } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import profilepic from "../../../assets/pp.png";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { FaMoneyBillAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useGlobalContext } from "@/contexts/Context";
import { MdOutlineCategory } from "react-icons/md";

function Sidebar() {
  const location = useLocation();
  const { user } = useGlobalContext();
  const role = user.role;
  
  const isActive = (path) =>
    location.pathname === path
      ? "bg-muted text-primary"
      : "";
      
  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="w-1/2 h-full fixed top-0 left-0 z-10000 overflow-y-auto bg-[#253036] text-white pb-5 md:w-1/5 md:text-xs">
      <div className="flex flex-col items-center bg-[#1C2428] text-beige py-2.5">
        {role == "admin" ? (
          <img 
            src={profilepic} 
            alt="Admin Logo" 
            className="w-22 h-22 rounded-full border-muted-200 border-2"
          />
        ) : (
          <div className="w-20 h-20 rounded-full text-foreground bg-accent flex items-center justify-center text-3xl font-black shadow-md select-none">
            {initials}
          </div>
        )}
        <p className="text-sm mt-2">{`${user.first_name} ${user.last_name}`}</p>
        <p className="text-xs opacity-80 mt-1">{user.email}</p>
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
      
      <div className="flex flex-col">
        <Link to="/dashboard/">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/")}`}
          >
            <FaHome />
            <p>Dashboard</p>
          </div>
        </Link>

        <Link to="/dashboard/orders">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/orders")}`}
          >
            <IoNewspaper />
            <p>Orders</p>
          </div>
        </Link>

        <Link to="/dashboard/customers">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/customers")}`}
          >
            <RiCustomerServiceFill />
            <p>Customers</p>
          </div>
        </Link>

        <Link to="/dashboard/products">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/products")}`}
          >
            <AiOutlineProduct />
            <p>Products</p>
          </div>
        </Link>
        
        <Link to="/dashboard/category">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/category")}`}
          >
            <MdOutlineCategory />
            <p>Category</p>
          </div>
        </Link>

        <Link to="/dashboard/revenue">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/revenue")}`}
          >
            <FaMoneyCheckDollar />
            <p>Revenue</p>
          </div>
        </Link>

        <Link to="/dashboard/messages">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/messages")}`}
          >
            <FaRegMessage />
            <p>Messages</p>
          </div>
        </Link>

        <Link to="/dashboard/currency">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/currency")}`}
          >
            <FaMoneyBillAlt />
            <p>Currency Rate</p>
          </div>
        </Link>
        
        <Link to="/dashboard/staff">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/staff")}`}
          >
            <FaUsers />
            <p>Staff</p>
          </div>
        </Link>
        
        <Link to="/dashboard/setting">
          <div
            className={`flex gap-2.5 items-center py-2.5 px-5 pl-7 cursor-pointer transition-colors duration-200 ${isActive("/dashboard/setting")}`}
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