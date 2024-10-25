import React from 'react';
import './GoogleMap.css'

const Map = () => {
  return (
    <div className='footer__map'>
            <div className="footer__map-link">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30137.288008990927!2d72.82510433518108!3d19.231813819282113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b128b333e163%3A0x985640540577af7e!2sBorivali%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1721273737535!5m2!1sen!2sin&hl=en&cookies_enabled=false" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                title='location map'
                >
              </iframe>
            </div>
        </div>
  );
};

export default Map;
