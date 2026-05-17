import { MapPin, MapPinned } from 'lucide-react';
import { coverageAreas } from '../../data';

function CoverageSection() {
  return (
    <section id="coverage" className="section">
      <div className="container coverage-grid">
        <div className="reveal">
          <h2>Complete Pune District Coverage</h2>
          <p className="lede small">
            From Pimpri-Chinchwad to Hadapsar, we cover every corner of Pune with our 4-hour service promise.
          </p>
          <div className="area-list">
            {coverageAreas.map((area) => (
              <p key={area}>
                <MapPin size={16} />
                <span>{area}</span>
              </p>
            ))}
          </div>
          <div className="hint-card">
            <MapPinned size={28} />
            <div>
              <strong>Check Your Area</strong>
              <span>Enter pincode to verify 4-hour delivery</span>
            </div>
          </div>
        </div>
        <div className="coverage-stat reveal delay-1">
          <MapPin size={84} />
          <strong>100%</strong>
          <span>Pune District Coverage</span>
        </div>
      </div>
    </section>
  );
}

export default CoverageSection;
