import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardCharts.css';

function DashboardCharts({ data }) {
  const {
    salesTrendData = [],
    orderStatusData = [],
    revenueByCategoryData = []
  } = data || {};

  const COLORS = ['#0f6b53', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color }}>
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-charts">
      {/* Sales Trends Chart */}
      <div className="chart-card full-width">
        <div className="chart-header">
          <div>
            <h3>Sales Trends</h3>
            <p className="chart-subtitle">Products vs Services Revenue</p>
          </div>
          <select className="chart-filter">
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="chart-content">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(245,247,250,0.6)" />
              <YAxis stroke="rgba(245,247,250,0.6)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="products" 
                stroke="#0f6b53" 
                strokeWidth={3}
                name="Products"
                dot={{ fill: '#0f6b53', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="services" 
                stroke="#d4af37" 
                strokeWidth={3}
                name="Services"
                dot={{ fill: '#d4af37', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Breakdown and Revenue by Category */}
      <div className="chart-row">
        {/* Order Status Breakdown Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Order Status</h3>
              <p className="chart-subtitle">Current breakdown</p>
            </div>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {orderStatusData.map((item, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ background: item.color }}></span>
                  <span className="legend-label">{item.status}</span>
                  <span className="legend-value">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by Category Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Revenue by Category</h3>
              <p className="chart-subtitle">This month</p>
            </div>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="category" stroke="rgba(245,247,250,0.6)" />
                <YAxis stroke="rgba(245,247,250,0.6)" />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-tooltip">
                          <p className="tooltip-label">{payload[0].payload.category}</p>
                          <p style={{ color: payload[0].fill }}>
                            Revenue: ₹{payload[0].value.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {revenueByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
