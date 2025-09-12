import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { UserInfo } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import ims_image from "../assets/ims_image.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useContext(UserInfo);
  const [isOpen, setIsOpen] = useState(false);

  const gotoLoginPage = async () => {
    if (authUser) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {}, { withCredentials: true });
        setAuthUser(null);
        toast.success(res.data.message);
      } catch (error) {
        console.error("Error during logout:", error);
        toast.error("Logout failed. Please try again.");
      }
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen">

      {/* Top bar */}
      <div className="p-2 flex justify-between items-center">
        <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/home")}>
          <img src={ims_image} alt="ims" className="h-12 w-12 object-contain" />
        </div>

        {/* Hamburger button for mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-3xl font-bold focus:outline-none">
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Login / Logout Button (Desktop Only) */}
        <div className="hidden md:block">
          <ShimmerButton onClick={gotoLoginPage} className="h-8 px-4">
            {authUser ? "Logout" : "Login"}
          </ShimmerButton>
        </div>
      </div>

      {/* Mobile navigation links */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-lg rounded-lg p-4 mx-4">
          {authUser && (
            <NavLink to="/home" className={({ isActive }) =>
              `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Home
            </NavLink>
          )}

          {authUser?.role === "admin" && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Dashboard
              </NavLink>
              <NavLink to="/products_admin" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Products
              </NavLink>
              <NavLink to="/categories" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Categories
              </NavLink>
              <NavLink to="/order_admin" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Orders
              </NavLink>
              <NavLink to="/suppliers" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Suppliers
              </NavLink>
              <NavLink to="/users" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Users
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Profile
              </NavLink>
            </>
          )}

          {authUser?.role === "customer" && (
            <>
              <NavLink to="/products_cus" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Products
              </NavLink>
              <NavLink to="/order_cus" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Orders
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) =>
                `block px-2 py-2 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
              }>
                Profile
              </NavLink>
            </>
          )}

          <div className="mt-3">
            <ShimmerButton onClick={gotoLoginPage} className="h-8 px-4 w-full">
              {authUser ? "Logout" : "Login"}
            </ShimmerButton>
          </div>
        </nav>
      )}

      {/* Desktop navigation links */}
      <nav className="hidden md:flex justify-center gap-8 shadow-sm p-3">
        {authUser && (
          <NavLink to="/home" className={({ isActive }) =>
            `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
          }>
            Home
          </NavLink>
        )}

        {authUser?.role === "admin" && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Dashboard
            </NavLink>
            <NavLink to="/products_admin" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Products
            </NavLink>
            <NavLink to="/categories" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Categories
            </NavLink>
            <NavLink to="/order_admin" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Orders
            </NavLink>
            <NavLink to="/suppliers" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Suppliers
            </NavLink>
            <NavLink to="/users" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Users
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Profile
            </NavLink>
          </>
        )}

        {authUser?.role === "customer" && (
          <>
            <NavLink to="/products_cus" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Products
            </NavLink>
            <NavLink to="/order_cus" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Orders
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) =>
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
            }>
              Profile
            </NavLink>
          </>
        )}
      </nav>

      {/* Page content */}
      <div className="p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
