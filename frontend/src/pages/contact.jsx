import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import ContactBreadcrumb from "@/components/breadcrumb/contact-breadcrumb";
import ContactArea from "@/components/contact/contact-area";
import ContactMap from "@/components/contact/contact-map";

const ContactPage = () => {
  return (
    <Wrapper>
      <SEO 
        pageTitle="Contact Us" 
        metaDesc="Get in touch with Vastrashahi for traditional clothing and accessories"
        metaKeywords="traditional clothing, contact vastrashahi, indian traditional wear"
      />
      <HeaderTwo style_2={true} />
      <ContactBreadcrumb />
      <div className="contact-page-wrapper">
        <ContactArea/>
        <ContactMap/>
      </div>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ContactPage;
