import React, { useState } from 'react';
import CSS from './Currency.module.css';

const Currency = () => {
  const [exchangeRate, setExchangeRate] = useState({
    usdToBirr: 56.5,
    lastUpdated: '2024-01-15',
    changePercentage: 1.2
  });

  const [newRate, setNewRate] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [rateHistory, setRateHistory] = useState([
    { date: '2024-01-15', rate: 56.5, reason: 'Market adjustment' },
    { date: '2024-01-14', rate: 55.8, reason: 'Central bank update' },
    { date: '2024-01-13', rate: 55.9, reason: 'Weekly adjustment' },
    { date: '2024-01-12', rate: 56.2, reason: 'Inflation update' },
    { date: '2024-01-11', rate: 56.0, reason: 'Market stabilization' }
  ]);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const handleRateUpdate = (e) => {
    e.preventDefault();
    if (newRate && changeReason) {
      const newRateValue = parseFloat(newRate);
      const oldRate = exchangeRate.usdToBirr;
      const changePercentage = ((newRateValue - oldRate) / oldRate * 100).toFixed(2);

      // Update current rate
      setExchangeRate({
        usdToBirr: newRateValue,
        lastUpdated: new Date().toISOString().split('T')[0],
        changePercentage: parseFloat(changePercentage)
      });

      // Add to history
      setRateHistory([
        {
          date: new Date().toISOString().split('T')[0],
          rate: newRateValue,
          reason: changeReason
        },
        ...rateHistory
      ]);

      // Reset form
      setNewRate('');
      setChangeReason('');
      setShowUpdateForm(false);

      alert('Exchange rate updated successfully!');
    }
  };

  const calculateTrend = (current, previous) => {
    return current > previous ? 'up' : current < previous ? 'down' : 'same';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className={CSS.currencyContainer}>
      <header className={CSS.header}>
        <h1 className={CSS.title}>Currency Exchange Rate</h1>
        <p className={CSS.subtitle}>USD to Ethiopian Birr (ETB) Management</p>
      </header>

      {/* Current Rate Display */}
      <div className={CSS.currentRateSection}>
        <div className={CSS.rateCard}>
          <div className={CSS.rateHeader}>
            <div className={CSS.currencyPair}>
              <span className={CSS.flag}>🇺🇸</span>
              <span className={CSS.currencyCode}>USD</span>
              <span className={CSS.arrow}>→</span>
              <span className={CSS.flag}>🇪🇹</span>
              <span className={CSS.currencyCode}>ETB</span>
            </div>
            <div className={CSS.lastUpdated}>
              Last updated: {exchangeRate.lastUpdated}
            </div>
          </div>

          <div className={CSS.rateDisplay}>
            <div className={CSS.rateValue}>
              1 USD = {exchangeRate.usdToBirr} ETB
            </div>
            <div className={`${CSS.changeIndicator} ${
              exchangeRate.changePercentage >= 0 ? CSS.positive : CSS.negative
            }`}>
              {getTrendIcon(exchangeRate.changePercentage >= 0 ? 'up' : 'down')}
              {Math.abs(exchangeRate.changePercentage)}%
            </div>
          </div>

          <button 
            className={CSS.updateButton}
            onClick={() => setShowUpdateForm(!showUpdateForm)}
          >
            {showUpdateForm ? 'Cancel Update' : 'Update Rate'}
          </button>
        </div>
      </div>

      {/* Update Form */}
      {showUpdateForm && (
        <div className={CSS.updateFormSection}>
          <form onSubmit={handleRateUpdate} className={CSS.updateForm}>
            <h3 className={CSS.formTitle}>Update Exchange Rate</h3>
            
            <div className={CSS.formGroup}>
              <label className={CSS.formLabel}>
                Current Rate: 1 USD = {exchangeRate.usdToBirr} ETB
              </label>
              <div className={CSS.inputGroup}>
                <span className={CSS.inputPrefix}>1 USD =</span>
                <input
                  type="number"
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="Enter new rate in ETB"
                  className={CSS.rateInput}
                  required
                />
                <span className={CSS.inputSuffix}>ETB</span>
              </div>
            </div>

            <div className={CSS.formGroup}>
              <label className={CSS.formLabel}>Reason for Change</label>
              <select
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                className={CSS.reasonSelect}
                required
              >
                <option value="">Select a reason</option>
                <option value="Market adjustment">Market adjustment</option>
                <option value="Central bank update">Central bank update</option>
                <option value="Inflation update">Inflation update</option>
                <option value="Market stabilization">Market stabilization</option>
                <option value="Weekly adjustment">Weekly adjustment</option>
                <option value="Economic factors">Economic factors</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {changeReason === 'Other' && (
              <div className={CSS.formGroup}>
                <input
                  type="text"
                  placeholder="Specify reason..."
                  className={CSS.customReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                />
              </div>
            )}

            <div className={CSS.formActions}>
              <button type="submit" className={CSS.submitButton}>
                Update Exchange Rate
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rate History */}
      <div className={CSS.historySection}>
        <h2 className={CSS.sectionTitle}>Exchange Rate History</h2>
        <div className={CSS.historyTable}>
          <div className={CSS.tableHeader}>
            <div className={CSS.tableCell}>Date</div>
            <div className={CSS.tableCell}>Rate (USD/ETB)</div>
            <div className={CSS.tableCell}>Change</div>
            <div className={CSS.tableCell}>Reason</div>
          </div>
          
          {rateHistory.map((record, index) => {
            const previousRate = rateHistory[index + 1]?.rate || record.rate;
            const trend = calculateTrend(record.rate, previousRate);
            const change = index === 0 ? 0 : record.rate - previousRate;
            
            return (
              <div key={index} className={CSS.tableRow}>
                <div className={CSS.tableCell}>{record.date}</div>
                <div className={CSS.tableCell}>
                  <strong>1 : {record.rate}</strong>
                </div>
                <div className={CSS.tableCell}>
                  {index > 0 && (
                    <span className={`${CSS.changeBadge} ${
                      trend === 'up' ? CSS.positive : 
                      trend === 'down' ? CSS.negative : CSS.neutral
                    }`}>
                      {getTrendIcon(trend)} {change > 0 ? '+' : ''}{change.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className={CSS.tableCell}>{record.reason}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className={CSS.statsSection}>
        <div className={CSS.statCard}>
          <div className={CSS.statIcon}>📊</div>
          <div className={CSS.statContent}>
            <h3 className={CSS.statValue}>{rateHistory.length}</h3>
            <p className={CSS.statLabel}>Updates This Month</p>
          </div>
        </div>
        
        <div className={CSS.statCard}>
          <div className={CSS.statIcon}>💰</div>
          <div className={CSS.statContent}>
            <h3 className={CSS.statValue}>
              {Math.min(...rateHistory.map(r => r.rate)).toFixed(2)}
            </h3>
            <p className={CSS.statLabel}>Lowest Rate</p>
          </div>
        </div>
        
        <div className={CSS.statCard}>
          <div className={CSS.statIcon}>💸</div>
          <div className={CSS.statContent}>
            <h3 className={CSS.statValue}>
              {Math.max(...rateHistory.map(r => r.rate)).toFixed(2)}
            </h3>
            <p className={CSS.statLabel}>Highest Rate</p>
          </div>
        </div>
        
        <div className={CSS.statCard}>
          <div className={CSS.statIcon}>📅</div>
          <div className={CSS.statContent}>
            <h3 className={CSS.statValue}>Daily</h3>
            <p className={CSS.statLabel}>Update Frequency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;