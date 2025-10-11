import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Products_Admin from './pages/Products_Admin';
import Products_Cus from './pages/Products_Cus';
import Categories from './pages/Categories';
import Orders_Admin from './pages/Orders_Admin';
import Orders_Cus from './pages/Orders_Cus';
import Suppliers from './pages/Suppliers';
import Profile from './pages/Profile';
import Users from './pages/Users';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import { useContext } from 'react';
import { UserInfo } from './context/AuthContext';
import imsImage from './assets/ims_image.png';

function App() {
  const { authUser, loading } = useContext(UserInfo);

  // Loader with logo and spinning ring
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-200">
        {/* Loader container */}
        <div className="relative w-32 h-32 flex justify-center items-center">
          {/* Rotating ring */}
          <div className="absolute w-32 h-32 rounded-full border-4 border-blue-400 border-t-transparent animate-spin-smooth"></div>

          {/* Logo */}
          <img
            src={imsImage}
            alt="Loading..."
            className="w-20 h-20 rounded-full shadow-2xl animate-glow z-10"
          />
        </div>

        {/* Text below loader */}
        <p className="mt-10 text-blue-600 font-semibold tracking-wide animate-pulse">
          Preparing your dashboard...
        </p>

        {/* Inline animations */}
        <style>{`
          @keyframes spin-smooth {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes glow {
            0%, 100% {
              filter: drop-shadow(0 0 15px rgba(59,130,246,0.6)) brightness(1.2);
            }
            50% {
              filter: drop-shadow(0 0 35px rgba(59,130,246,0.9)) brightness(1.5);
            }
          }
          .animate-spin-smooth {
            animation: spin-smooth 1.8s linear infinite;
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Main routes
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={authUser ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="products_admin" element={authUser ? <Products_Admin /> : <Navigate to="/" />} />
        <Route path="products_cus" element={authUser ? <Products_Cus /> : <Navigate to="/" />} />
        <Route path="categories" element={authUser ? <Categories /> : <Navigate to="/" />} />
        <Route path="order_admin" element={authUser ? <Orders_Admin /> : <Navigate to="/" />} />
        <Route path="order_cus" element={authUser ? <Orders_Cus /> : <Navigate to="/" />} />
        <Route path="suppliers" element={authUser ? <Suppliers /> : <Navigate to="/" />} />
        <Route path="users" element={authUser ? <Users /> : <Navigate to="/" />} />
        <Route path="profile" element={authUser ? <Profile /> : <Navigate to="/" />} />
      </Route>

      <Route path="/signin" element={authUser ? <Navigate to="/" /> : <SignIn />} />
      <Route path="/register" element={authUser ? <Navigate to="/" /> : <Register />} />
    </Routes>
  );
}

export default App;
