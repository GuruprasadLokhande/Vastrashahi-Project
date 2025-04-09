import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";

const HeaderTopRight = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  // handle logout
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push('/')
  }
  
  return (
    <div className="tp-header-top-menu d-flex align-items-center justify-content-end">
      <div className="tp-header-top-menu-item">
        <Link href="/profile">My Profile</Link>
      </div>
      <div className="tp-header-top-menu-item">
        {!user?.name && <Link href="/login" className="cursor-pointer">Login</Link>}
        {user?.name && <a onClick={handleLogout} className="cursor-pointer">Logout</a>}
      </div>
    </div>
  );
};

export default HeaderTopRight;
