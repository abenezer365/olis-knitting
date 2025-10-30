import React from 'react'
import Analytics from './Analytics/Analytics'
import Orders from './Orders/Orders'
import Customers from './Customers/Customers'
import Staffs from './Staffs/Staffs'
import Messages from './Messages/Messages'
import Products from './Products/Products'
import Header from './Header/Header'
import Sidebar from './Sidebar/Sidebar'
import CSS from './Dashboard.module.css'
import {Routes, Route} from 'react-router-dom'
import NotFound from './NotFound/NotFound'
import { useState } from 'react'
import useWidth from '../../hooks/useWidth';
import Revenue from './Revenue/Revenue'
import Setting from './Setting/Setting'
import Currency from './Currency/Currency'

function Dashboard() {
    const width = useWidth()
   const [showSidebar, setShowSidebar] = useState(true)   
  return (
    <div className={CSS.dashboard_container}>
        {
          width > 850 &&  (
            <div className={`${CSS.sidebar} ${!showSidebar && CSS.hide} `}>
                <Sidebar />
             </div>
          )
        }
       
      <div className={CSS.body}>
        <Header className={CSS.header} value={[showSidebar,setShowSidebar]}/>
        <div className={CSS.content}>
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/staff" element={<Staffs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/setting" element={<Setting />} />
          <Route path='/*' element={<NotFound />}/>
        </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
