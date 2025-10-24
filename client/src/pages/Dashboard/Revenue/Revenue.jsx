import React from 'react';
import CSS from './Revenue.module.css';

const Revenue = () => {
  // Mock revenue data
  const revenueData = {
    totalRevenue: 125430,
    monthlyGrowth: 12.5,
    activeCustomers: 2847,
    averageOrderValue: 156.75,
    revenueStreams: [
      { category: 'Product Sales', amount: 89450, percentage: 71.3 },
      { category: 'Subscriptions', amount: 28750, percentage: 22.9 },
      { category: 'Services', amount: 5620, percentage: 4.5 },
      { category: 'Other', amount: 1610, percentage: 1.3 }
    ],
    monthlyTrend: [
      { month: 'Jan', revenue: 112000 },
      { month: 'Feb', revenue: 118500 },
      { month: 'Mar', revenue: 121200 },
      { month: 'Apr', revenue: 119800 },
      { month: 'May', revenue: 124300 },
      { month: 'Jun', revenue: 125430 }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className={CSS.revenueContainer}>
      <header className={CSS.header}>
        <h1 className={CSS.title}>Revenue Dashboard</h1>
        <p className={CSS.subtitle}>Financial performance overview</p>
      </header>

      {/* Key Metrics Cards */}
      <div className={CSS.metricsGrid}>
        <div className={CSS.metricCard}>
          <div className={CSS.metricIcon}>💰</div>
          <div className={CSS.metricContent}>
            <h3 className={CSS.metricLabel}>Total Revenue</h3>
            <p className={CSS.metricValue}>{formatCurrency(revenueData.totalRevenue)}</p>
            <div className={CSS.growthIndicator}>
              <span className={CSS.growthPositive}>↑ {revenueData.monthlyGrowth}% this month</span>
            </div>
          </div>
        </div>

        <div className={CSS.metricCard}>
          <div className={CSS.metricIcon}>👥</div>
          <div className={CSS.metricContent}>
            <h3 className={CSS.metricLabel}>Active Customers</h3>
            <p className={CSS.metricValue}>{revenueData.activeCustomers.toLocaleString()}</p>
            <div className={CSS.growthIndicator}>
              <span className={CSS.growthPositive}>↑ 8.2% growth</span>
            </div>
          </div>
        </div>

        <div className={CSS.metricCard}>
          <div className={CSS.metricIcon}>🛒</div>
          <div className={CSS.metricContent}>
            <h3 className={CSS.metricLabel}>Avg Order Value</h3>
            <p className={CSS.metricValue}>{formatCurrency(revenueData.averageOrderValue)}</p>
            <div className={CSS.growthIndicator}>
              <span className={CSS.growthPositive}>↑ 3.1% increase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Streams */}
      <div className={CSS.revenueStreams}>
        <h2 className={CSS.sectionTitle}>Revenue Streams</h2>
        <div className={CSS.streamsGrid}>
          {revenueData.revenueStreams.map((stream, index) => (
            <div key={index} className={CSS.streamCard}>
              <div className={CSS.streamHeader}>
                <h3 className={CSS.streamCategory}>{stream.category}</h3>
                <span className={CSS.streamPercentage}>{stream.percentage}%</span>
              </div>
              <p className={CSS.streamAmount}>{formatCurrency(stream.amount)}</p>
              <div className={CSS.progressBar}>
                <div 
                  className={CSS.progressFill}
                  style={{ width: `${stream.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className={CSS.trendSection}>
        <h2 className={CSS.sectionTitle}>Monthly Revenue Trend</h2>
        <div className={CSS.trendChart}>
          {revenueData.monthlyTrend.map((month) => (
            <div key={month.month} className={CSS.trendBar}>
              <div 
                className={CSS.barFill}
                style={{ 
                  height: `${(month.revenue / revenueData.monthlyTrend.reduce((max, m) => Math.max(max, m.revenue), 0)) * 100}%` 
                }}
              ></div>
              <span className={CSS.barLabel}>{month.month}</span>
              <span className={CSS.barValue}>{formatCurrency(month.revenue)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className={CSS.quickStats}>
        <div className={CSS.statItem}>
          <span className={CSS.statNumber}>98%</span>
          <span className={CSS.statLabel}>Customer Retention</span>
        </div>
        <div className={CSS.statItem}>
          <span className={CSS.statNumber}>24h</span>
          <span className={CSS.statLabel}>Avg Payment Time</span>
        </div>
        <div className={CSS.statItem}>
          <span className={CSS.statNumber}>12.8%</span>
          <span className={CSS.statLabel}>YoY Growth</span>
        </div>
      </div>
    </div>
  );
};

export default Revenue;