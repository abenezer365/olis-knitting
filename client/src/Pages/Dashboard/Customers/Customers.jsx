import React, { useState } from 'react';
import CSS from './customers.module.css';

const Customers = () => {
  const [customers, ] = useState([
    {
      id: 1, name: 'Alexander Mitchell', email: 'alex.mitchell@techcorp.com', phone: '+1 (555) 234-5678',
      status: 'VIP', joinDate: '2023-01-15', orders: 47, totalSpent: 12540,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 2, name: 'Sophia Rodriguez', email: 's.rodriguez@designstudio.com', phone: '+1 (555) 345-6789',
      status: 'Premium', joinDate: '2022-11-20', orders: 89, totalSpent: 28750,
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6K7q9HlliqaeipPJpAVw5FTTPoacIIFb_MQ&s'
    },
    {
      id: 3, name: 'Marcus Chen', email: 'marcus.chen@financegroup.com', phone: '+1 (555) 456-7890',
      status: 'Regular', joinDate: '2023-03-10', orders: 12, totalSpent: 3200,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 4, name: 'Isabella Thompson', email: 'isabella.t@luxurybrands.com', phone: '+1 (555) 567-8901',
      status: 'VIP', joinDate: '2022-08-05', orders: 156, totalSpent: 89200,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    return CSS[status.toLowerCase()];
  };

  return (
    <div className={CSS.container}>
      <div className={CSS.header}>
        <h1>Customer Management</h1>
        <div className={CSS.controls}>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={CSS.search}
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={CSS.filter}
          >
            <option value="All">All Status</option>
            <option value="VIP">VIP</option>
            <option value="Premium">Premium</option>
            <option value="Regular">Regular</option>
          </select>
        </div>
      </div>

      <table className={CSS.table}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Orders</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(customer => (
            <tr key={customer.id}>
              <td>
                <div className={CSS.customer}>
                  <img src={customer.avatar} alt={customer.name} className={CSS.avatar} />
                  <span>{customer.name}</span>
                </div>
              </td>
              <td>
                <div className={CSS.contact}>
                  <div>{customer.email}</div>
                  <div className={CSS.phone}>{customer.phone}</div>
                </div>
              </td>
              <td>
                <span className={`${CSS.status} ${getStatusClass(customer.status)}`}>
                  {customer.status}
                </span>
              </td>
              <td className={CSS.orders}>{customer.orders}</td>
              <td>{new Date(customer.joinDate).toLocaleDateString()}</td>
              <td>
                <div className={CSS.actions}>
                  <button className={CSS.edit}>Edit</button>
                  <button className={CSS.delete}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;