import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import { MapPin, MapPinned } from 'lucide-react';
import { fetchAllCoverageAreas } from '../../firebase/coverageService';
import 'leaflet/dist/leaflet.css';

function CoverageSection() {
  const [coverageAreas, setCoverageAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delivery zones for map visualization
  const deliveryZones = [
    {
      id: 1,
      name: 'Pimpri-Chinchwad',
      coordinates: [
        [18.6450, 73.7550],
        [18.6450, 73.8500],
        [18.5950, 73.8500],
        [18.5950, 73.7550],
      ],
      color: '#3b82f6',
    },
    {
      id: 2,
      name: 'Kothrud & Warje',
      coordinates: [
        [18.5200, 73.8000],
        [18.5200, 73.8400],
        [18.4900, 73.8400],
        [18.4900, 73.8000],
      ],
      color: '#10b981',
    },
    {
      id: 3,
      name: 'Hadapsar & Magarpatta',
      coordinates: [
        [18.5200, 73.9200],
        [18.5200, 73.9700],
        [18.4800, 73.9700],
        [18.4800, 73.9200],
      ],
      color: '#f59e0b',
    },
    {
      id: 4,
      name: 'Shivajinagar & Camp',
      coordinates: [
        [18.5350, 73.8450],
        [18.5350, 73.8750],
        [18.5100, 73.8750],
        [18.5100, 73.8450],
      ],
      color: '#ef4444',
    },
    {
      id: 5,
      name: 'Aundh & Baner',
      coordinates: [
        [18.5700, 73.7900],
        [18.5700, 73.8300],
        [18.5400, 73.8300],
        [18.5400, 73.7900],
      ],
      color: '#8b5cf6',
    },
    {
      id: 6,
      name: 'Wakad & Hinjewadi',
      coordinates: [
        [18.6100, 73.7200],
        [18.6100, 73.7900],
        [18.5700, 73.7900],
        [18.5700, 73.7200],
      ],
      color: '#ec4899',
    },
    {
      id: 7,
      name: 'Kharadi',
      coordinates: [
        [18.5650, 73.9300],
        [18.5650, 73.9600],
        [18.5400, 73.9600],
        [18.5400, 73.9300],
      ],
      color: '#06b6d4',
    },
    {
      id: 8,
      name: 'Wagholi',
      coordinates: [
        [18.5950, 73.9650],
        [18.5950, 74.0050],
        [18.5650, 74.0050],
        [18.5650, 73.9650],
      ],
      color: '#84cc16',
    },
    {
      id: 9,
      name: 'Viman Nagar',
      coordinates: [
        [18.5850, 73.9050],
        [18.5850, 73.9250],
        [18.5600, 73.9250],
        [18.5600, 73.9050],
      ],
      color: '#f43f5e',
    },
    {
      id: 10,
      name: 'Koregaon Park',
      coordinates: [
        [18.5450, 73.8850],
        [18.5450, 73.9050],
        [18.5250, 73.9050],
        [18.5250, 73.8850],
      ],
      color: '#a855f7',
    },
    {
      id: 11,
      name: 'Kalyani Nagar',
      coordinates: [
        [18.5550, 73.8950],
        [18.5550, 73.9150],
        [18.5350, 73.9150],
        [18.5350, 73.8950],
      ],
      color: '#eab308',
    },
    {
      id: 12,
      name: 'Katraj',
      coordinates: [
        [18.4600, 73.8450],
        [18.4600, 73.8750],
        [18.4350, 73.8750],
        [18.4350, 73.8450],
      ],
      color: '#14b8a6',
    },
  ];

  useEffect(() => {
    const loadCoverageAreas = async () => {
      try {
        const data = await fetchAllCoverageAreas();
        // Sort by order field
        const sortedData = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCoverageAreas(sortedData);
      } catch (error) {
        console.error('Error loading coverage areas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoverageAreas();
  }, []);

  return (
    <section id="coverage" className="section">
      <div className="container">
        <header className="section-head reveal">
          <h2>Complete Pune District Coverage</h2>
          <p className="lede small" style={{ margin: '0.5rem auto 0' }}>
            From Pimpri-Chinchwad to Hadapsar, we cover every corner of PMC and PCMC with our 4-hour service promise.
          </p>
        </header>
        <div className="coverage-grid">
          <div className="reveal">
          {loading ? (
            <div style={{ color: 'var(--muted)', padding: '1rem 0' }}>Loading coverage areas...</div>
          ) : coverageAreas.length === 0 ? (
            <div style={{ color: 'var(--muted)', padding: '1rem 0' }}>No coverage areas available yet.</div>
          ) : (
            <div className="area-list">
              {coverageAreas.map((area) => (
                <p key={area.id}>
                  <MapPin size={16} />
                  <span>{area.name}</span>
                </p>
              ))}
            </div>
          )}
            <div className="hint-card">
              <MapPinned size={28} />
              <div>
                <strong>Check Your Area</strong>
                <span>Enter pincode to verify 4-hour delivery</span>
              </div>
            </div>
          </div>
          <div className="coverage-map-container reveal delay-1">
          <MapContainer
            center={[18.5550, 73.8200]}
            zoom={11}
            style={{ height: '100%', width: '100%', borderRadius: '1.25rem' }}
            className="leaflet-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {deliveryZones.map((zone) => (
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
                  <div style={{ textAlign: 'center', color: '#1a1f2b' }}>
                    <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '0.25rem' }}>{zone.name}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>4-hour delivery available</span>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>          </div>        </div>
      </div>
    </section>
  );
}

export default CoverageSection;
