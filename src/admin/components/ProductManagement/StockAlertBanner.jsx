import React from 'react';
import { AlertTriangle, X, Filter } from 'lucide-react';

function StockAlertBanner({ lowStockCount, onViewAlerts, onDismiss }) {
  if (lowStockCount === 0) return null;

  return (
    <div className="stock-alert-banner">
      <div className="alert-content">
        <AlertTriangle size={20} className="alert-icon" />
        <div className="alert-text">
          <strong>{lowStockCount} product{lowStockCount > 1 ? 's' : ''}</strong> 
          {' '}running low on stock (less than 10 units)
        </div>
      </div>
      <div className="alert-actions">
        <button className="alert-btn view" onClick={onViewAlerts}>
          <Filter size={16} />
          View Alerts
        </button>
        <button className="alert-btn dismiss" onClick={onDismiss}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default StockAlertBanner;
