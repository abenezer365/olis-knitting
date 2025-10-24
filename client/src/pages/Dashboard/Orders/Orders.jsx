import React, {useEffect, useState} from 'react';
import CSS from './Orders.module.css';
import { orderData } from '../../../data/data';
import { FaTrash, FaEdit } from 'react-icons/fa';

function Orders() {
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    setOrdersData(orderData);
  }, []);

 return (
    <div className={CSS.container}>
      <h2 className={CSS.heading}>All Orders</h2>

      <div className={CSS.tableWrapper}>
        <table className={CSS.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Detail</th>
              <th>Quantity</th>
              <th>Total ($)</th>
              <th>Client Detail</th>
              <th>Status</th>
              <th>Action</th>
              <th>Manage</th>
            </tr>
          </thead>

          <tbody>
            {ordersData.map((order) => (
              <tr key={order.order_id}>
                <td>{order.id}</td>
                <td className={CSS.detail_cell}>
                  <img className={CSS.product_img} src={order.image} alt="" />
                  <div className={CSS.product_detail}>
                      <strong>{order.title}</strong>
                      <br />
                      {order.description}
                      <br />
                      <strong>Price: ${order.price}</strong>
                      <br />
                      {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </td>

                <td>
                  X{order.quantity}
                </td>

                <td>${order.total}</td>

                <td>
                   <strong>{order.client.name}</strong>
                      <br />
                      {order.client.email}
                      <br />
                      {order.client.phone}
                      <br />
                      {order.client.location}
                </td>

                <td>
                  <p className={CSS.completed}>{order.status}</p>
                  <p className={CSS.review}>{order.status}</p>
                  <p className={CSS.inProgress}>{order.status}</p>
                </td>
                <td>
                  <p className={CSS.mark}>Mark Completed</p>
                  <p className={CSS.progress}>Mark Pending</p>
                  <p className={CSS.progress}>Mark Payed</p>
                </td>
                                <td className={CSS.actions}>
                  <FaEdit className={CSS.editIcon} />
                  <FaTrash className={CSS.deleteIcon} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;

// import React, { useEffect, useState } from 'react';
// import CSS from './Orders.module.CSS';
// import { CiSearch } from "react-icons/ci";
// import { orderData } from '../../../data/data';

// function Orders() {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     setOrders(orderData);
//   }, []);


//   const togglePayment = (id) => {
//     setOrders(prev =>
//       prev.map(order =>
//         order.id === id
//           ? { ...order, paymentStatus: order.paymentStatus === "Paid" ? "Not Paid" : "Paid" }
//           : order
//       )
//     );
//   };

//   const toggleOrder = (id) => {
//     setOrders(prev =>
//       prev.map(order =>
//         order.id === id
//           ? { ...order, orderStatus: order.orderStatus === "Completed" ? "In Progress" : "Completed" }
//           : order
//       )
//     );
//   };

//   const toggleDelivery = (id) => {
//     setOrders(prev =>
//       prev.map(order =>
//         order.id === id
//           ? { ...order, deliveryStatus: order.deliveryStatus === "Delivered" ? "Not Delivered" : "Delivered" }
//           : order
//       )
//     );
//   };

//   return (
//     <div className={CSS.orders}>
      
//       <div className={CSS.top}>
//         <h2>Explore Orders</h2>
//         <div className={CSS.search}>
//           <input type="search" placeholder='Search product' />
//           <CiSearch />
//         </div>
//       </div>


//       <div className={CSS.tableWrapper}>
//         <table className={CSS.orderTable}>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Product</th>
//               <th>Client Info</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.id} className={CSS.tableRow}>
//                 <td>{order.id}</td>
//                 <td>
//                   <div className={CSS.productCell}>
//                     <img src={order.image} alt={order.title} />
//                     <div>
//                       <h4>{order.title}</h4>
//                       <p>{order.description}</p>
//                       <p>
//                         Qty: {order.quantity} | ${order.price} each | 
//                         <strong> Total: ${order.total}</strong>
//                       </p>
//                     </div>
//                   </div>
//                 </td>

//                 <td>
//                   <div className={CSS.clientCell}>
//                     <strong>{order.client.name}</strong>
//                     <p>{order.client.email}</p>
//                     <p>{order.client.location}</p>
//                     <p>{order.client.phone}</p>
//                     <p>⭐ {order.client.rating}</p>
//                   </div>
//                 </td>

//                 <td>
//                   <div className={CSS.statusCell}>
//                     <span className={`${CSS.badge} ${order.paymentStatus === "Paid" ? CSS.paid : CSS.notPaid}`}>
//                       Payment: {order.paymentStatus}
//                     </span>
//                     <span className={`${CSS.badge} ${order.orderStatus === "Completed" ? CSS.completed : CSS.inProgress}`}>
//                       Order: {order.orderStatus}
//                     </span>
//                     <span className={`${CSS.badge} ${order.deliveryStatus === "Delivered" ? CSS.delivered : CSS.notDelivered}`}>
//                       Delivery: {order.deliveryStatus}
//                     </span>
//                   </div>
//                 </td>

//                 <td>
//                   <div className={CSS.actionPanel}>
//                     <button onClick={() => togglePayment(order.id)}>Toggle Payment</button>
//                     <button onClick={() => toggleOrder(order.id)}>Toggle Order</button>
//                     <button onClick={() => toggleDelivery(order.id)}>Toggle Delivery</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Orders;
