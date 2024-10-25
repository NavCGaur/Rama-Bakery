import React from 'react';
import './Map.css';

const Map = () => {
  const handleMapClick = () => {
    window.open("https://www.openstreetmap.org/?mlat=19.231813819282113&mlon=72.82510433518108#map=12/19.2318/72.8251", "_blank");
  };

  return (
    <div className='footer__map'>
      <div className="footer__map-link" onClick={handleMapClick} style={{ cursor: 'pointer' }}>
        <iframe 
          src="https://www.openstreetmap.org/export/embed.html?bbox=72.82510433518108%2C19.231813819282113%2C72.82510433518108%2C19.231813819282113&layer=mapnik"
          style={{ border: 0 }} // Adjust the height as needed
          allowFullScreen
          loading="lazy"
          title="Our Location on OpenStreetMap"
        ></iframe>
      </div>
    </div>
  );
};

export default Map;
