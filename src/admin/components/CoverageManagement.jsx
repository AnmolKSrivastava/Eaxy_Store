import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import { MapPin, Package, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './CoverageManagement.css';

function CoverageManagement() {
  const [deliveryZones, setDeliveryZones] = useState([
    {
      id: 1,
      name: 'Pimpri-Chinchwad',
      area: 'PCMC',
      coordinates: [
        [18.6450, 73.7550],
        [18.6450, 73.8500],
        [18.5950, 73.8500],
        [18.5950, 73.7550],
      ],
      color: '#3b82f6',
      active: true,
      activeOrders: 23,
      avgDeliveryTime: '3.5 hours',
      coverage: '95%',
    },
    {
      id: 2,
      name: 'Kothrud & Warje',
      area: 'West Pune',
      coordinates: [
        [18.5200, 73.8000],
        [18.5200, 73.8400],
        [18.4900, 73.8400],
        [18.4900, 73.8000],
      ],
      color: '#10b981',
      active: true,
      activeOrders: 34,
      avgDeliveryTime: '3.2 hours',
      coverage: '98%',
    },
    {
      id: 3,
      name: 'Hadapsar & Magarpatta',
      area: 'East Pune',
      coordinates: [
        [18.5200, 73.9200],
        [18.5200, 73.9700],
        [18.4800, 73.9700],
        [18.4800, 73.9200],
      ],
      color: '#f59e0b',
      active: true,
      activeOrders: 28,
      avgDeliveryTime: '3.6 hours',
      coverage: '92%',
    },
    {
      id: 4,
      name: 'Shivajinagar & Camp',
      area: 'Central Pune',
      coordinates: [
        [18.5350, 73.8450],
        [18.5350, 73.8750],
        [18.5100, 73.8750],
        [18.5100, 73.8450],
      ],
      color: '#ef4444',
      active: true,
      activeOrders: 45,
      avgDeliveryTime: '2.8 hours',
      coverage: '100%',
    },
    {
      id: 5,
      name: 'Aundh & Baner',
      area: 'North-West Pune',
      coordinates: [
        [18.5700, 73.7900],
        [18.5700, 73.8300],
        [18.5400, 73.8300],
        [18.5400, 73.7900],
      ],
      color: '#8b5cf6',
      active: true,
      activeOrders: 38,
      avgDeliveryTime: '3.4 hours',
      coverage: '96%',
    },
    {
      id: 6,
      name: 'Wakad & Hinjewadi',
      area: 'IT Corridor',
      coordinates: [
        [18.6100, 73.7200],
        [18.6100, 73.7900],
        [18.5700, 73.7900],
        [18.5700, 73.7200],
      ],
      color: '#ec4899',
      active: true,
      activeOrders: 41,
      avgDeliveryTime: '3.3 hours',
      coverage: '94%',
    },
    {
      id: 7,
      name: 'Kharadi',
      area: 'IT Hub East',
      coordinates: [
        [18.5650, 73.9300],
        [18.5650, 73.9600],
        [18.5400, 73.9600],
        [18.5400, 73.9300],
      ],
      color: '#06b6d4',
      active: true,
      activeOrders: 52,
      avgDeliveryTime: '3.1 hours',
      coverage: '97%',
    },
    {
      id: 8,
      name: 'Wagholi',
      area: 'Extended East',
      coordinates: [
        [18.5950, 73.9650],
        [18.5950, 74.0050],
        [18.5650, 74.0050],
        [18.5650, 73.9650],
      ],
      color: '#84cc16',
      active: true,
      activeOrders: 29,
      avgDeliveryTime: '3.7 hours',
      coverage: '88%',
    },
    {
      id: 9,
      name: 'Viman Nagar',
      area: 'Airport Zone',
      coordinates: [
        [18.5850, 73.9050],
        [18.5850, 73.9250],
        [18.5600, 73.9250],
        [18.5600, 73.9050],
      ],
      color: '#f43f5e',
      active: true,
      activeOrders: 47,
      avgDeliveryTime: '2.9 hours',
      coverage: '99%',
    },
    {
      id: 10,
      name: 'Koregaon Park',
      area: 'Premium District',
      coordinates: [
        [18.5450, 73.8850],
        [18.5450, 73.9050],
        [18.5250, 73.9050],
        [18.5250, 73.8850],
      ],
      color: '#a855f7',
      active: true,
      activeOrders: 36,
      avgDeliveryTime: '3.0 hours',
      coverage: '96%',
    },
    {
      id: 11,
      name: 'Kalyani Nagar',
      area: 'Business Hub',
      coordinates: [
        [18.5550, 73.8950],
        [18.5550, 73.9150],
        [18.5350, 73.9150],
        [18.5350, 73.8950],
      ],
      color: '#eab308',
      active: true,
      activeOrders: 43,
      avgDeliveryTime: '3.1 hours',
      coverage: '95%',
    },
    {
      id: 12,
      name: 'Katraj',
      area: 'South Pune',
      coordinates: [
        [18.4600, 73.8450],
        [18.4600, 73.8750],
        [18.4350, 73.8750],
        [18.4350, 73.8450],
      ],
      color: '#14b8a6',
      active: true,
      activeOrders: 26,
      avgDeliveryTime: '3.5 hours',
      coverage: '91%',
    },
  ]);

  const toggleZoneStatus = (zoneId) => {
    setDeliveryZones((zones) =>
      zones.map((zone) =>
        zone.id === zoneId ? { ...zone, active: !zone.active } : zone
      )
    );
  };

  const totalActiveZones = deliveryZones.filter((z) => z.active).length;
  const totalActiveOrders = deliveryZones
    .filter((z) => z.active)
    .reduce((sum, z) => sum + z.activeOrders, 0);
  const avgCoverage =
    deliveryZones
      .filter((z) => z.active)
      .reduce((sum, z) => sum + parseFloat(z.coverage), 0) / totalActiveZones;

  return (
    <div className="coverage-management">
      <div className="coverage-header">
        <div>
          <h1>🗺️ Delivery Coverage Management</h1>
          <p className="coverage-subtitle">
            Manage delivery zones across Pune & Pimpri-Chinchwad
          </p>
        </div>
      </div>

      <div className="coverage-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)' }}>
            <MapPin size={24} />
          </div>
          <div className="stat-details">
            <h3>{totalActiveZones}/12</h3>
            <p>Active Zones</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div className="stat-details">
            <h3>{totalActiveOrders}</h3>
            <p>Active Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <h3>{avgCoverage.toFixed(1)}%</h3>
            <p>Avg Coverage</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <h3>4 Hours</h3>
            <p>Delivery Guarantee</p>
          </div>
        </div>
      </div>

      <div className="coverage-content">
        <div className="map-section">
          <div className="map-header">
            <h3>📍 Pune & PCMC Coverage Map</h3>
            <p className="map-subtitle">Interactive zones with real-time status</p>
          </div>
          <MapContainer
            center={[18.5550, 73.8200]}
            zoom={11}
            style={{ height: '600px', width: '100%', borderRadius: '12px' }}
            className="leaflet-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {deliveryZones
              .filter((zone) => zone.active)
              .map((zone) => (
                <Polygon
                  key={zone.id}
                  positions={zone.coordinates}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: 0.35,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="zone-popup">
                      <h4>{zone.name}</h4>
                      <p><strong>Area:</strong> {zone.area}</p>
                      <p><strong>Active Orders:</strong> {zone.activeOrders}</p>
                      <p><strong>Avg Delivery:</strong> {zone.avgDeliveryTime}</p>
                      <p><strong>Coverage:</strong> {zone.coverage}</p>
                    </div>
                  </Popup>
                </Polygon>
              ))}
          </MapContainer>
        </div>

        <div className="zones-panel">
          <div className="zones-header">
            <h3>🎯 Delivery Zones</h3>
            <p className="zones-subtitle">Enable/disable zones as needed</p>
          </div>
          <div className="zones-list">
            {deliveryZones.map((zone) => (
              <div key={zone.id} className={`zone-card ${zone.active ? 'active' : 'inactive'}`}>
                <div className="zone-header">
                  <div className="zone-color" style={{ background: zone.color }}></div>
                  <div className="zone-info">
                    <h4>{zone.name}</h4>
                    <p className="zone-area">{zone.area}</p>
                  </div>
                  <button
                    className={`toggle-btn ${zone.active ? 'active' : ''}`}
                    onClick={() => toggleZoneStatus(zone.id)}
                  >
                    {zone.active ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </button>
                </div>
                <div className="zone-stats">
                  <div className="zone-stat">
                    <Package size={16} />
                    <span>{zone.activeOrders} orders</span>
                  </div>
                  <div className="zone-stat">
                    <Clock size={16} />
                    <span>{zone.avgDeliveryTime}</span>
                  </div>
                  <div className="zone-stat">
                    <MapPin size={16} />
                    <span>{zone.coverage} coverage</span>
                  </div>
                </div>
                <div className="zone-status">
                  {zone.active ? (
                    <span className="status-active">🟢 Active</span>
                  ) : (
                    <span className="status-inactive">⚫ Inactive</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverageManagement;
