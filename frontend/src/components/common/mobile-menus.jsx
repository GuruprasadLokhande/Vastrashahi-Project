import React, { useState } from "react";
import Link from "next/link";
import { mobile_menu } from "@/data/menu-data";

const MobileMenus = ({ isOpen, setIsOpen }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleSubmenu = (id) => {
    if (activeMenu === id) {
      setActiveMenu(null);
    } else {
      setActiveMenu(id);
    }
  };

  return (
    <div className="mobile-menu-wrapper">
      <nav className="tp-main-menu-content">
        <ul className="mobile-menu-list">
          {mobile_menu.map((item) => (
            <li key={item.id} className={`mobile-menu-item ${item.sub_menu ? 'has-dropdown' : ''} ${activeMenu === item.id ? 'active' : ''}`}>
              {item.sub_menu ? (
                <>
                  <div className="mobile-menu-link-wrapper">
                    <span className="mobile-menu-link">{item.title}</span>
                    <button 
                      onClick={() => handleSubmenu(item.id)}
                      className="dropdown-toggle-btn"
                    >
                      <i className={`fa-solid ${activeMenu === item.id ? 'fa-angle-down' : 'fa-angle-right'}`}></i>
                    </button>
                  </div>
                  <ul className={`sub-menu ${activeMenu === item.id ? 'active' : ''}`}>
                    {item.sub_menus.map((subItem, i) => (
                      <li key={i} className="sub-menu-item">
                        <Link href={subItem.link} onClick={() => setIsOpen(false)}>
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={item.link} className="mobile-menu-link" onClick={() => setIsOpen(false)}>
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .mobile-menu-wrapper {
          padding: 0 20px;
        }
        
        .mobile-menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .mobile-menu-item {
          border-bottom: 1px solid #eaeaea;
        }
        
        .mobile-menu-link-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .mobile-menu-link {
          display: block;
          padding: 12px 0;
          font-size: 16px;
          font-weight: 500;
          color: #333;
          text-decoration: none;
        }
        
        .dropdown-toggle-btn {
          background: transparent;
          border: none;
          color: #666;
          font-size: 16px;
          padding: 5px;
          cursor: pointer;
        }
        
        .sub-menu {
          display: none;
          list-style: none;
          padding-left: 15px;
          margin: 0;
        }
        
        .sub-menu.active {
          display: block;
        }
        
        .sub-menu-item {
          padding: 5px 0;
        }
        
        .sub-menu-item a {
          display: block;
          padding: 8px 0;
          font-size: 15px;
          color: #666;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default MobileMenus;
