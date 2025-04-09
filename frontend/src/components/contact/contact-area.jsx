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
                <div className="tp-contact-info-wrapper d-flex justify-content-between align-items-center">
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
          <div className="row">
            {/* Potdar Brother Jewellers */}
            <div className="col-xl-6 col-lg-6">
              <div className="tp-partner-item p-relative mb-50">
                <div className="tp-partner-content text-center">
                  <h3 className="tp-partner-title" style={{ fontSize: '2.5rem', color: '#FFB396' }}>
                    Potdar Brother Jewellers
                  </h3>
                  <div className="tp-partner-contact mt-30">
                    <p><i className="fa-solid fa-phone"></i> +91 1234567890</p>
                    <p><i className="fa-solid fa-location-dot"></i> Rashiwade Bk || Tale - Radhanagari, Kolhapur, Maharashtra, 416211</p>
                  </div>
                </div>
              </div>
            </div>
            {/* New Maintrin Ladies Shop */}
            <div className="col-xl-6 col-lg-6">
              <div className="tp-partner-item p-relative mb-50">
                <div className="tp-partner-content text-center">
                  <h3 className="tp-partner-title" style={{ fontSize: '2.5rem', color: '#FFB396' }}>
                    New Maintrin Ladies Shop
                  </h3>
                  <div className="tp-partner-contact mt-30">
                    <p><i className="fa-solid fa-phone"></i> +91 9876543210</p>
                    <p><i className="fa-solid fa-location-dot"></i> Rashiwade Bk || Tale - Radhanagari, Kolhapur, Maharashtra, 416211</p>
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
