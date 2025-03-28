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
                        <a href="mailto:contact@shofy.com">contact@shofy.com</a>
                      </p>
                      <p data-info="phone">
                        <a href="tel:670-413-90-762">+670 413 90 762</a>
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
                          href="https://www.google.com/maps/place/New+York,+NY,+USA/@40.6976637,-74.1197638,11z/data=!3m1!4b1!4m6!3m5!1s0x89c24fa5d33f083b:0xc80b8f06e177fe62!8m2!3d40.7127753!4d-74.0059728!16zL20vMDJfMjg2"
                          target="_blank"
                        >
                          84 sleepy hollow st. <br /> jamaica, New York 1432
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
                          <a href="#">
                            <i className="fa-brands fa-facebook-f"></i>
                          </a>
                          <a href="#">
                            <i className="fa-brands fa-twitter"></i>
                          </a>
                          <a href="#">
                            <i className="fa-brands fa-linkedin-in"></i>
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
                <span className="tp-section-title-pre-2">
                  Our Partners
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2">
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
                  <h3 className="tp-partner-title" style={{ fontFamily: 'Marathi', fontSize: '2.5rem', color: '#FFB396' }}>
                    पोतदार ब्रदर्स ज्वेलर्स
                  </h3>
                  <p className="tp-partner-subtitle">Potdar Brother Jewellers</p>
                  <div className="tp-partner-contact mt-30">
                    <p><i className="fa-solid fa-phone"></i> +91 1234567890</p>
                    <p><i className="fa-solid fa-location-dot"></i> 123 Jewellery Street, Mumbai, Maharashtra</p>
                  </div>
                </div>
              </div>
            </div>
            {/* New Maintrin Ladies Shop */}
            <div className="col-xl-6 col-lg-6">
              <div className="tp-partner-item p-relative mb-50">
                <div className="tp-partner-content text-center">
                  <h3 className="tp-partner-title" style={{ fontFamily: 'Marathi', fontSize: '2.5rem', color: '#FFB396' }}>
                  न्यू मैत्रीण लेडीज शॉपी
                  </h3>
                  <p className="tp-partner-subtitle">New Maintrin Ladies Shop</p>
                  <div className="tp-partner-contact mt-30">
                    <p><i className="fa-solid fa-phone"></i> +91 9876543210</p>
                    <p><i className="fa-solid fa-location-dot"></i> 456 Fashion Avenue, Pune, Maharashtra</p>
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
