import React from 'react'
import CSS from './Analytics.module.css';
import {  PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from 'react-router-dom';
function Analytics() {
   const COLORS = ["#A67C52", "#D6B893", "#EBDDC7", "#BFA98E", "#8B6E4B"];

   const salesdata = [
      { productName: "Sweater", sales: 340 },
      { productName: "Scarf", sales: 280 },
      { productName: "Gloves", sales: 210 },
      { productName: "Socks", sales: 150 }
    ];

  const revenueData = [
      { category: "Sweaters", revenue: 12400 },
      { category: "Scarves", revenue: 8900 },
      { category: "Socks", revenue: 5200 },
      { category: "Gloves", revenue: 4100 },
      { category: "Hats", revenue: 3000 },
    ];

  const stats = [
    { label: "Customers", value: 340, suffix: "+", color: "#1C2428", path : "customers" },
    { label: "Products in Stock", value: 450, suffix: "+", color: "#A67C52", path : "products"  },
    { label: "Total Orders", value: 127, suffix: "+", color: "#D6C6B8", path : "orders"  },
    { label: "Revenue", value: "$15,600", suffix: "", color: "#F5DEB3", path : "revenue"  },
  ];
  
  return (
    <div className={CSS.analytics}>

      <div className={CSS.statsContainer}>
      {stats.map((item, index) => (
        <Link key={index} to={`/dashboard/${item?.path}`} className={CSS.statBox}>
          <h2 style={{ color: item.color }}>
            {item.value}
            <span className={CSS.suffix}>{item.suffix}</span>
          </h2>
          <p>{item.label}</p>
        </Link>
      ))}
    </div>

      <div className={CSS.graphs}>
      <div className={CSS.bargraph}>
      <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesdata}>
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#EED5B7" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
      </div>

      <div className={CSS.piegraph}>
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {revenueData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
      </div>

      </div>
    </div>
  )
}

export default Analytics
