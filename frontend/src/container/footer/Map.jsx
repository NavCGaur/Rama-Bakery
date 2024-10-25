import React from 'react';
import './Map.css';

const Map = () => {
  const mapUrl = "https://www.openstreetmap.org/?mlat=19.231813819282113&mlon=72.82510433518108#map=12/19.2318/72.8251";

  return (
    <div className='footer__map'>
      <a href={mapUrl} target="_blank" rel="noopener noreferrer">
        <div className="footer__map-link">
          <iframe 
            src="https://www.openstreetmap.org/export/embed.html?bbox=72.82510433518108%2C19.231813819282113%2C72.82510433518108%2C19.231813819282113&layer=mapnik"
            style={{ border: 0}} 
            allowFullScreen
            loading="lazy"
            title="Our Location on OpenStreetMap"
          ></iframe>
        </div>
      </a>
    </div>
  );
};

export default Map;
