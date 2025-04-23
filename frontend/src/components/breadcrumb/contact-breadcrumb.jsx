import React from "react";
import Link from "next/link";

const ContactBreadcrumb = () => {
  return (
    <section className="breadcrumb__area include-bg text-center pt-95 pb-50">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="breadcrumb__content p-relative z-index-1">
              <h3 className="breadcrumb__title mb-15">Connect With Vastrashahi</h3>
              <p className="breadcrumb__subtitle d-none d-md-block mb-20">We're here to assist with your traditional clothing needs</p>
              <div className="breadcrumb__list">
                <span>
                  <Link href="/">Home</Link>
                </span>
                <span className="dvdr"><i className="fa-regular fa-angle-right"></i></span>
                <span>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBreadcrumb;
