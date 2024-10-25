import React from 'react';
import './GoogleMap.css'

const GoogleMap = () => {
  return (
    <div className='footer__map'>
            <div className="footer__google-map">
            <iframe 
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.82510433518108%2C19.231813819282113%2C72.82510433518108%2C19.231813819282113&layer=mapnik"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Our Location on OpenStreetMap"
            ></iframe>

            </div>
        </div>
  );
};

export default GoogleMap;
