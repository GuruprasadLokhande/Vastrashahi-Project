import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";

// Instagram Icon Component
function InstagramIcon() {
  return (
    <div className="tp-header-top-menu-item tp-header-instagram">
      <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="tp-header-instagram-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </Link>
    </div>
  );
}

// setting
function ProfileSetting({active,handleActive}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  // handle logout
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push('/')
  }
  return (
    <div className="tp-header-top-menu-item tp-header-setting">
      <span
        onClick={() => handleActive('setting')}
        className="tp-header-setting-toggle"
        id="tp-header-setting-toggle"
      >
        Setting
      </span>
      <ul className={active === 'setting' ? "tp-setting-list-open" : ""}>
        <li>
          <Link href="/profile">My Profile</Link>
        </li>
        <li>
          <Link href="/wishlist">Wishlist</Link>
        </li>
        <li>
          <Link href="/cart">Cart</Link>
        </li>
        <li>
          {!user?.name &&<Link href="/login" className="cursor-pointer">Login</Link>}
          {user?.name &&<a onClick={handleLogout} className="cursor-pointer">Logout</a>}
        </li>
      </ul>
    </div>
  );
}

const HeaderTopRight = () => {
  const [active, setIsActive] = useState('');
  // handle active
  const handleActive = (type) => {
    if(type === active){
      setIsActive('')
    }
    else {
      setIsActive(type)
    }
  }
  return (
    <div className="tp-header-top-menu d-flex align-items-center justify-content-end">
      <InstagramIcon />
      <ProfileSetting active={active} handleActive={handleActive} />
    </div>
  );
};

export default HeaderTopRight;
