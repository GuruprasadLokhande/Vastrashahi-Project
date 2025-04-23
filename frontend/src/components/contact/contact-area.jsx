import React from "react";
import Image from "next/image";
// internal
import ContactForm from "../forms/contact-form";
import contact_icon_1 from "@assets/img/contact/contact-icon-1.png";
import contact_icon_2 from "@assets/img/contact/contact-icon-2.png";
import contact_icon_3 from "@assets/img/contact/contact-icon-3.png";
import { TextShapeLine } from "@/svg";

const ContactArea = () => {
  return (
    <>
      <section className="tp-contact-area pb-100">
        <div className="container">
          <div className="tp-contact-inner">
            <div className="row">
              <div className="col-xl-12">
                <div className="row g-4">
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="tp-contact-info-item">
                      <div className="tp-contact-info-icon">
                        <span>
                          <Image src={contact_icon_1} alt="contact-icon" />
                        </span>
                      </div>
                      <div className="tp-contact-info-content">
                        <p data-info="mail">
                          <a href="mailto:info@vastrashahi.com">info@vastrashahi.com</a>
                        </p>
                        <p data-info="phone">
                          <a href="tel:+91-9876543210">+91 9876543210</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="tp-contact-info-item">
                      <div className="tp-contact-info-icon">
                        <span>
                          <Image src={contact_icon_2} alt="contact-icon" />
                        </span>
                      </div>
                      <div className="tp-contact-info-content">
                        <p>
                          <a
                            href="https://maps.app.goo.gl/qZfTZdfY3QP55qLs8"
                            target="_blank"
                          >
                            Rashiwade Bk || Tale - Radhanagari <br /> Dist - Kolhapur, Maharashtra, India, 416211
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="tp-contact-info-item">
                      <div className="tp-contact-info-icon">
                        <span>
                          <Image src={contact_icon_3} alt="contact-icon" />
                        </span>
                      </div>
                      <div className="tp-contact-info-content">
                        <div className="tp-contact-social-wrapper">
                          <h4 className="tp-contact-social-title">
                            Find on social media
                          </h4>

                          <div className="tp-contact-social-icon">
                            <a href="https://facebook.com/vastrashahi" target="_blank">
                              <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="https://instagram.com/vastrashahi" target="_blank">
                              <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://youtube.com/vastrashahi" target="_blank">
                              <i className="fa-brands fa-youtube"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="tp-partners-area pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 text-center mb-50">
                <span className="tp-section-title-pre-2" style={{ color: '#FFB396' }}>
                  Our Partners
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2" style={{ color: '#ffffff' }}>
                  Our Trusted Partners
                </h3>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {/* Potdar Brother Jewellers */}
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="tp-partner-item p-relative mb-30 mb-lg-0">
                <div className="tp-partner-content text-center p-3">
                  <h3 className="tp-partner-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#FFB396' }}>
                    Potdar Brother Jewellers
                  </h3>
                  <div className="tp-partner-contact mt-20">
                    <p className="mb-2"><i className="fa-solid fa-phone me-2"></i> +91 1234567890</p>
                    <p><i className="fa-solid fa-location-dot me-2"></i> Rashiwade Bk || Tale - Radhanagari, Kolhapur, Maharashtra, 416211</p>
                  </div>
                </div>
              </div>
            </div>
            {/* New Maintrin Ladies Shop */}
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="tp-partner-item p-relative mb-0">
                <div className="tp-partner-content text-center p-3">
                  <h3 className="tp-partner-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#FFB396' }}>
                    New Maintrin Ladies Shop
                  </h3>
                  <div className="tp-partner-contact mt-20">
                    <p className="mb-2"><i className="fa-solid fa-phone me-2"></i> +91 9876543210</p>
                    <p><i className="fa-solid fa-location-dot me-2"></i> Rashiwade Bk || Tale - Radhanagari, Kolhapur, Maharashtra, 416211</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactArea;
