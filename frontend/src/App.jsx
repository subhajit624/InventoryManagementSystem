import './App.css'
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

function App() {
  const { authUser, loading } = useContext(UserInfo);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

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

      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
