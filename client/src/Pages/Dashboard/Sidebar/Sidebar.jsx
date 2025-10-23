import React from 'react'
import CSS from './Sidebar.module.css'
import { FaHome } from "react-icons/fa";
import { IoNewspaper } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { RiCustomerServiceFill } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { FaRegMessage } from "react-icons/fa6";
import profilepic from '../../../assets/pp.png';
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { FaMoneyBillAlt } from "react-icons/fa";

function Sidebar() {
  const role = 'admin'
  return (
        <div className={CSS.sidebar}>
            <div className={CSS.profile}>
              <h4>
              {
                role === 'admin' ? 'ADMIN' : role === 'manager' ? 'MANAGER' : role === 'employee' ? 'EMPLOYEE' : 'MR. X'
              }
              </h4>
              <img src={profilepic} alt="Iftu Tilahun" />
              <p className={CSS.pp_title}>Iftu Tilahun</p>
              <p className={CSS.pp_subtitle}>CEO Oli's</p>
            </div>
            <div className={CSS.routes}>
                <Link to="/dashboard/">     
                <div className={CSS.single}>
                    <FaHome />
                    <p>Dashboard</p>
                </div>
                </Link>  
              <span>Automation</span>
                <Link to="/dashboard/orders">
                <div className={CSS.single}>
                  <IoNewspaper />
                  <p>Orders</p>
              </div>
              </Link> 
              <Link to="/dashboard/customers">
                <div className={CSS.single}>
                  <RiCustomerServiceFill />
                  <p>Customers</p>
              </div>
              </Link>
              <Link to="/dashboard/products">
                <div className={CSS.single}>
                  <AiOutlineProduct />
                  <p>Products</p>
              </div>
              </Link>
              <Link to="/dashboard/revenue">
                <div className={CSS.single}>
                  <FaMoneyCheckDollar />
                  <p>Revenue</p>
              </div>
              </Link>
              <Link to="/dashboard/messages">
                <div className={CSS.single}>
                  <FaRegMessage />
                  <p>Messages</p>
              </div>
              </Link>
               <Link to="/dashboard/currency">
                  <div className={CSS.single}>
                      <FaMoneyBillAlt />
                      <p>Currency Rate</p>
                  </div>
              </Link> 
</div>
</div>
    )
}

export default Sidebar
