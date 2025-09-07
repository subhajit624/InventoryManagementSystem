import React, { useContext } from 'react';
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { UserInfo } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import ims_image from "../assets/ims_image.png";



const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useContext(UserInfo);

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
        <div>
          <ShimmerButton onClick={gotoLoginPage} className="h-8 px-4">
            {authUser ? "Logout" : "Login"}
          </ShimmerButton>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex justify-center gap-8 shadow-sm p-3">
        {/* Public */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`
          }
        >
          Home
        </NavLink>

        {/* Admin Only */}
        {authUser?.role === "admin" && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
              Dashboard
            </NavLink>
            <NavLink to="/products_admin" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
              Products
            </NavLink>
            <NavLink to="/categories" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
              Categories
            </NavLink>
            <NavLink to="/order_admin" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
              Orders
            </NavLink>
            <NavLink to="/suppliers" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
              Suppliers
            </NavLink>
            <NavLink to="/users" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
              Users
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
              Profile
            </NavLink>
          </>
        )}

        {/* Customer Only */}
        {authUser?.role === "customer" && (
          <>
            <NavLink to="/products_cus" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
              Products
            </NavLink>
            <NavLink to="/order_cus" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
              Orders
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => 
              `px-2 pb-1 text-lg ${isActive ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
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
