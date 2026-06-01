import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, ShoppingCart, Wrench, PackageX, CheckCircle, Settings } from 'lucide-react';
import './DashboardOverview.css';
import DashboardCharts from './DashboardCharts';
import { getOrderStats, getAllOrders } from '../../firebase/orderService';
import { getAllRepairBookings } from '../../firebase/repairBookingService';
import { fetchAllProducts } from '../../firebase/productsService';

function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState(null);

  const getLast6Months = () => {
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push({
        label: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth()
      });
    }
    return result;
  };

  const tsToDate = (ts) => {
    if (!ts) return new Date(0);
    if (ts.seconds) return new Date(ts.seconds * 1000);
    return new Date(ts);
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [orderStats, allOrders, allBookings, allProducts] = await Promise.all([
        getOrderStats(),
        getAllOrders(),
        getAllRepairBookings(),
        fetchAllProducts()
      ]);

      const activeOrders = (orderStats.pending || 0) + (orderStats.processing || 0) + (orderStats.outForDelivery || 0);
      const pendingRepairs = allBookings.filter(b => b.status === 'pending').length;
      const completedRepairs = allBookings.filter(b => b.status === 'completed').length;
      const repairRevenue = allBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.servicePrice || 0), 0);
      const avgRepair = completedRepairs > 0 ? repairRevenue / completedRepairs : 0;
      const outOfStock = allProducts.filter(p => p.inStock === false).length;
      const revenue = orderStats.totalRevenue || 0;
      const avgOrder = orderStats.averageOrderValue || 0;
      const delivered = orderStats.delivered || 0;
      const total = orderStats.total || 0;
      const compliance = orderStats.complianceRate ? orderStats.complianceRate.toFixed(0) : 0;

      setMetrics([
        {
          title: 'Total Revenue',
          value: `₹${revenue.toLocaleString('en-IN')}`,
          change: `₹${Math.round(avgOrder).toLocaleString('en-IN')} avg`,
          period: 'from delivered orders',
          icon: DollarSign,
          color: '#0f6b53',
          trend: 'up'
        },
        {
          title: 'Repair Revenue',
          value: `₹${repairRevenue.toLocaleString('en-IN')}`,
          change: `₹${Math.round(avgRepair).toLocaleString('en-IN')} avg`,
          period: 'from completed repairs',
          icon: Wrench,
          color: '#d4af37',
          trend: 'up'
        },
        {
          title: 'Active Orders',
          value: String(activeOrders),
          change: `${orderStats.pending || 0} pending`,
          period: `${total} total orders`,
          icon: ShoppingCart,
          color: '#3b82f6',
          trend: activeOrders > 0 ? 'up' : 'neutral'
        },
        {
          title: 'Repair Requests',
          value: String(allBookings.length),
          change: `${pendingRepairs} pending`,
          period: `${completedRepairs} completed`,
          icon: Settings,
          color: '#8b5cf6',
          trend: 'neutral'
        },
        {
          title: 'Out of Stock',
          value: String(outOfStock),
          change: outOfStock > 0 ? 'Needs restocking' : 'All in stock',
          period: `of ${allProducts.length} products`,
          icon: PackageX,
          color: outOfStock > 0 ? '#ef4444' : '#10b981',
          trend: outOfStock > 0 ? 'down' : 'up'
        },
        {
          title: 'Orders Delivered',
          value: String(delivered),
          change: `${compliance}% on time`,
          period: 'within 4 hours',
          icon: CheckCircle,
          color: '#d4af37',
          trend: 'up'
        }
      ]);

      // Monthly sales trend (last 6 months) — exclude cancelled
      const months = getLast6Months();
      const salesTrendData = months.map(({ label, year, month }) => {
        const products = allOrders
          .filter(o => {
            if (o.status === 'cancelled') return false;
            const d = tsToDate(o.orderDate);
            return d.getFullYear() === year && d.getMonth() === month;
          })
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const services = allBookings
          .filter(b => {
            if (b.status === 'cancelled') return false;
            const d = tsToDate(b.createdAt);
            return d.getFullYear() === year && d.getMonth() === month;
          })
          .reduce((sum, b) => sum + (b.servicePrice || 0), 0);
        return { month: label, products, services };
      });

      // Order status breakdown (exclude 0-count)
      const orderStatusData = [
        { status: 'Pending', count: orderStats.pending || 0, color: '#f59e0b' },
        { status: 'Processing', count: orderStats.processing || 0, color: '#3b82f6' },
        { status: 'Out for Delivery', count: orderStats.outForDelivery || 0, color: '#8b5cf6' },
        { status: 'Delivered', count: orderStats.delivered || 0, color: '#10b981' },
        { status: 'Cancelled', count: orderStats.cancelled || 0, color: '#ef4444' }
      ].filter(s => s.count > 0);

      // Create productId to category mapping
      const productCategoryMap = new Map();
      allProducts.forEach(product => {
        productCategoryMap.set(product.id, product.category || 'Other');
      });

      // Revenue by category from delivered order items using actual product categories
      const categoryMap = {};
      allOrders
        .filter(o => o.status === 'delivered')
        .forEach(order => {
          (order.items || []).forEach(item => {
            // Get actual category from products collection using productId
            const cat = productCategoryMap.get(item.productId) || 'Other';
            categoryMap[cat] = (categoryMap[cat] || 0) + (item.subtotal || 0);
          });
        });
      const revenueByCategoryData = Object.entries(categoryMap)
        .map(([category, revenue]) => ({ category, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setChartData({ salesTrendData, orderStatusData, revenueByCategoryData });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="dashboard-subtitle">
            {loading ? 'Loading real-time data...' : 'Live data from Firebase — updated now.'}
          </p>
        </div>
        {!loading && (
          <div className="dashboard-actions">
            <button className="dashboard-btn secondary" onClick={loadDashboardData}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8A6 6 0 1 1 8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 2L11 5M8 2L5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh
            </button>
          </div>
        )}
      </div>

      <div className="metrics-grid">
        {loading
          ? [...Array(6)].map((_, i) => <div key={i} className="metric-card skeleton-card" />)
          : metrics.map((metric, index) => {
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
            })
        }
      </div>

      {!loading && chartData && <DashboardCharts data={chartData} />}
    </div>
  );
}

export default DashboardOverview;
