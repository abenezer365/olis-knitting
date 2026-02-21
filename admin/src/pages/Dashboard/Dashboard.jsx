import React, { useEffect } from 'react'
import Analytics from './Analytics/Analytics'
import Orders from './Orders/Orders'
import Customers from './Customers/Customers'
import Staffs from './Staffs/Staffs'
import Messages from './Messages/Messages'
import Products from './Products/Products'
import Header from './Header/Header'
import Sidebar from './Sidebar/Sidebar'
import {Routes, Route} from 'react-router-dom'
import { useState } from 'react'
import useWidth from '../../hooks/useWidth';
import Revenue from './Revenue/Revenue'
import Setting from './Setting/Setting'
import Currency from './Currency/Currency'
import Category from './Category/Category'
import Shipping from './Shipping/Shipping'
import Unavailable from '../Unavailable/Unavailable'

function Dashboard() {
    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },[]);
    const width = useWidth()
   const [showSidebar, setShowSidebar] = useState(true)   
  return (
    <div className="flex w-full">
        {
          width > 850 &&  (
            <div className={`${showSidebar ? 'w-1/4 mr-2.5' : 'hidden'} h-screen`}>
                <Sidebar />
             </div>
          )
        }
       
      <div className="w-full">
        <Header className="w-[90%]" value={[showSidebar,setShowSidebar]}/>
        <div className="w-full mt-5">
        <Routes>
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/staff" element={<Staffs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category" element={<Category />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/*" element={<Unavailable />} />
        </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard