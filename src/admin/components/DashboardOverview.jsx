import React from 'react';
import { DollarSign, ShoppingCart, Wrench, PackageX, Star } from 'lucide-react';
import './DashboardOverview.css';
import DashboardCharts from './DashboardCharts';

function DashboardOverview() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '₹2,45,680',
      change: '+12.5%',
      period: 'vs last month',
      icon: DollarSign,
      color: '#0f6b53',
      trend: 'up'
    },
    {
      title: 'Active Orders',
      value: '48',
      change: '+8',
      period: 'today',
      icon: ShoppingCart,
      color: '#3b82f6',
      trend: 'up'
    },
    {
      title: 'Repair Requests',
      value: '23',
      change: '5 pending',
      period: 'this week',
      icon: Wrench,
      color: '#f59e0b',
      trend: 'neutral'
    },
    {
      title: 'Low Stock Alerts',
      value: '12',
      change: '3 critical',
      period: 'items',
      icon: PackageX,
      color: '#ef4444',
      trend: 'down'
    },
    {
      title: 'Satisfaction Score',
      value: '4.8',
      change: '+0.2',
      period: 'out of 5.0',
      icon: Star,
      color: '#d4af37',
      trend: 'up'
    }
  ];

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="dashboard-actions">
          <button className="dashboard-btn secondary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 2H2V14H14V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 5H14M5 2V14" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Export Report
          </button>
          <button className="dashboard-btn primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Order
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <div className="metric-icon" style={{ background: `${metric.color}20`, color: metric.color }}>
                  <Icon size={20} />
                </div>
                <span className={`metric-trend ${metric.trend}`}>
                  {metric.change}
                </span>
              </div>
              
              <div className="metric-content">
                <h3 className="metric-value">{metric.value}</h3>
                <p className="metric-title">{metric.title}</p>
                <span className="metric-period">{metric.period}</span>
              </div>
            </div>
          );
        })}
      </div>

      <DashboardCharts />
    </div>
  );
}

export default DashboardOverview;
