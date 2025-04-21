import React, { useState } from "react";
import Link from "next/link";
import { mobile_menu } from "@/data/menu-data";

const MobileMenus = () => {
  const [isActiveMenu, setIsActiveMenu] = useState("");

  // handleOpenSubMenu
  const handleOpenSubMenu = (title) => {
    if (title === isActiveMenu) {
      setIsActiveMenu("");
    } else {
      setIsActiveMenu(title);
    }
  };

  return (
    <nav className="tp-main-menu-content">
      {mobile_menu.map((menu) => (
        <ul key={menu.id}>
          <li className={`${menu.sub_menu ? 'has-dropdown' : ''} ${isActiveMenu === menu.title ? 'dropdown-opened' : ''}`}>
            {menu.sub_menu ? (
              <>
                <a className={isActiveMenu === menu.title ? 'expanded' : ''}>
                  {menu.title}
                  <button
                    onClick={() => handleOpenSubMenu(menu.title)}
                    className={`dropdown-toggle-btn ${isActiveMenu === menu.title ? 'dropdown-opened' : ''}`}
                  >
                    <i className="fa-regular fa-angle-right"></i>
                  </button>
                </a>
                <ul className={`tp-submenu ${isActiveMenu === menu.title ? 'active' : ''}`}>
                  {menu.sub_menus.map((submenu, i) => (
                    <li key={i}>
                      <Link href={submenu.link}>{submenu.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link href={menu.link}>{menu.title}</Link>
            )}
          </li>
        </ul>
      ))}
    </nav>
  );
};

export default MobileMenus;
