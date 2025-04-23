import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// internal
import { CloseTwo } from '@/svg';
import logo from '@assets/img/logo/logo.svg';
import MobileCategory from '@/layout/headers/header-com/mobile-category';

const OffCanvas = ({ isOffCanvasOpen, setIsCanvasOpen, categoryType = "electronics" }) => {
  const [isCategoryActive, setIsCategoryActive] = useState(false);

  return (
    <>
      <div className={`offcanvas__area offcanvas__radius ${isOffCanvasOpen ? "offcanvas-opened" : ""}`}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__close">
            <button onClick={() => setIsCanvasOpen(false)} className="offcanvas__close-btn offcanvas-close-btn">
              <CloseTwo />
            </button>
          </div>
          <div className="offcanvas__content">
            <div className="offcanvas__top mb-20 d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo logo">
                <Link href="/">
                  <span className="vastrashahi-logo">Vastrashahi</span>
                </Link>
              </div>
            </div>
            <div className="offcanvas__category pb-20">
              <button onClick={() => setIsCategoryActive(!isCategoryActive)} className="tp-offcanvas-category-toggle">
                <i className="fa-solid fa-bars"></i>
                All Categories
                <i className="fa-solid fa-angle-down ms-2"></i>
              </button>
              <div className="tp-category-mobile-menu">
                <nav className={`tp-category-menu-content ${isCategoryActive ? "active" : ""}`}>
                  <MobileCategory categoryType={categoryType} isCategoryActive={isCategoryActive} />
                </nav>
              </div>
            </div>
          </div>
          
          <div className="offcanvas__bottom">
            <div className="offcanvas__btn text-center mt-30 mb-20">
              <Link href="/contact" className="tp-btn-2 tp-btn-border-2 w-100">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
      {/* body overlay start */}
      <div onClick={() => setIsCanvasOpen(false)} className={`body-overlay ${isOffCanvasOpen ? 'opened' : ''}`}></div>
      {/* body overlay end */}

      <style jsx>{`
        .tp-offcanvas-category-toggle {
          display: block;
          width: 100%;
          background-color: #FF5722;
          color: white;
          border: none;
          padding: 12px;
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          border-radius: 4px;
          position: relative;
        }
        
        .tp-offcanvas-category-toggle i.fa-bars {
          margin-right: 8px;
        }
        
        .tp-offcanvas-category-toggle i.fa-angle-down {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .tp-category-menu-content {
          display: none;
          background-color: white;
          border: 1px solid #eaeaea;
          border-top: none;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .tp-category-menu-content.active {
          display: block;
        }
        
        .offcanvas__btn .tp-btn-2 {
          display: inline-block;
          padding: 12px 20px;
          background-color: transparent;
          color: #333;
          font-weight: 500;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .offcanvas__btn .tp-btn-2:hover {
          background-color: #FF5722;
          color: white;
          border-color: #FF5722;
        }
      `}</style>
    </>
  );
};

export default OffCanvas;