import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
// internal
import { ArrowRightLong, PrevLongArrTwo } from '@/svg';

// tagline data
const vastrashahi_taglines = [
  {
    id: 1,
    title: "Tradition Meets Style",
    desc: "Discover authentic Indian clothing crafted with passion and precision. Our collection brings together traditional aesthetics with modern comfort.",
    btn_text: "Shop Collection",
    btn_link: "/shop"
  },
  {
    id: 2,
    title: "Crafted with Care",
    desc: "Every piece in our collection is carefully crafted by skilled artisans, preserving the rich heritage of Indian textiles and craftsmanship.",
    btn_text: "Our Story",
    btn_link: "/about"
  },
  {
    id: 3,
    title: "For Every Occasion",
    desc: "From festive celebrations to everyday elegance, find the perfect attire that reflects your personal style and cultural heritage.",
    btn_text: "Explore Categories",
    btn_link: "/shop"
  },
];

// slider setting
const slider_setting = {
  slidesPerView: 1,
  spaceBetween: 0,
  pagination: {
    el: ".tp-testimonial-slider-dot",
    clickable: true,
  },
  navigation: {
    nextEl: ".tp-testimonial-slider-button-next",
    prevEl: ".tp-testimonial-slider-button-prev",
  },
}

const FashionTestimonial = () => {
  return (
    <>
      <section className="tp-testimonial-area grey-bg-7 pt-130 pb-135">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-12">
              <div className="tp-testimonial-slider p-relative z-index-1">
                <div className="tp-testimonial-shape">
                  <span className="tp-testimonial-shape-gradient"></span>
                </div>
                <h3 className="tp-testimonial-section-title text-center">Experience Vastrashahi</h3>
                <div className="row justify-content-center">
                  <div className="col-xl-8 col-lg-8 col-md-10">

                    <Swiper {...slider_setting} modules={[Navigation, Pagination]} className="tp-testimonial-slider-active swiper-container">
                      {vastrashahi_taglines.map(item => (
                        <SwiperSlide key={item.id} className="tp-testimonial-item text-center mb-20">
                          <div className="tp-testimonial-content">
                            <h4 className="mb-3" style={{ color: '#821F40', fontSize: '24px', fontWeight: '700' }}>{item.title}</h4>
                            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{item.desc}</p>
                          </div> 
                          <div className="tp-testimonial-btn mt-4">
                            <Link href={item.btn_link} className="tp-btn tp-btn-border">
                              {item.btn_text}
                            </Link>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
                <div className="tp-testimonial-arrow d-none d-md-block">
                  <button className="tp-testimonial-slider-button-prev">
                    <PrevLongArrTwo />
                  </button>
                  <button className="tp-testimonial-slider-button-next">
                    <ArrowRightLong />
                  </button>
                </div>
                <div className="tp-testimonial-slider-dot tp-swiper-dot text-center mt-30 tp-swiper-dot-style-darkRed d-md-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default dynamic(() => Promise.resolve(FashionTestimonial), { ssr: false });