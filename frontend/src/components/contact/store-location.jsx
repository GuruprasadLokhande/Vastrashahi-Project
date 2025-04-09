import React from 'react';

const StoreLocation = () => {
  return (
    <div className="tp-contact-map-area pt-90 pb-90">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="tp-section-title-wrapper mb-50 text-center">
              <h3 className="tp-section-title">Find Our Store</h3>
              <p>Visit us at Rashiwade Bk || Tale - Radhanagari, Dist - Kolhapur, Maharashtra, India, 416211</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-contact-map">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.566582199148!2d74.09850607519179!3d16.547964584203093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc0519ac4962f27%3A0xf6dcf89d40dd3d36!2sVastrashahi%20-%20sampurn%20kutumbasathi%20shahi%20vastradalan!5e0!3m2!1sen!2sin!4v1744003176209!5m2!1sen!2sin" 
                width="100%" 
                height="450" 
                style={{border: 0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocation; 