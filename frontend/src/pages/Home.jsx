import { UserInfo } from '@/context/AuthContext';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { authUser } = useContext(UserInfo);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-150 bg-gray-100">
      {/* Card Container */}
      <div className="bg-gray-100  p-10 w-[90%] md:w-[600px] text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">
          Welcome Back{authUser ? `, ${authUser.name}` : ""}
        </h1>
        <br />
        <br />

        {/* Subtitle */}
        {!authUser ? (
          <p className="text-gray-600 text-lg mb-8">
            Please login to continue and manage your orders.
          </p>
        ) : (
          <p className="text-gray-500 text-lg mb-8">
            Glad to see you here 👋
          </p>
        )}

        {/* Buttons */}
        {!authUser ? (
          <button
            onClick={() => navigate("/signin")}
            className="px-8 py-3 bg-purple-600 text-white cursor-pointer text-lg font-medium rounded-xl shadow-md hover:shadow-xl hover:bg-purple-700 transition"
          >
            Login
          </button>
        ) : authUser.role === "admin" ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-blue-600 text-white cursor-pointer text-lg font-medium rounded-xl shadow-md hover:shadow-xl hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        ) : authUser.role === "customer" ? (
          <button
            onClick={() => navigate("/products_cus")}
            className="px-8 py-3 bg-green-600 text-white cursor-pointer text-lg font-medium rounded-xl shadow-md hover:shadow-xl hover:bg-green-700 transition"
          >
            Go to Products
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
