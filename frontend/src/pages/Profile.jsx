import { UserInfo } from '@/context/AuthContext';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import toast,{Toaster} from 'react-hot-toast';

const Profile = () => {
  const { authUser } = useContext(UserInfo);
  const [name, setName] = useState(authUser ? authUser.name : '');
  const [gmail, setGmail] = useState(authUser ? authUser.gmail : '');
  const [address, setAddress] = useState(authUser ? authUser.address : '');

  const changeInfo = async() => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/updateProfile`, { name, gmail, address }, { withCredentials: true });
      if(res.data.success){
        authUser.name = name;
        authUser.gmail = gmail;
        authUser.address = address;
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error during updating profile:", error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-200 px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-gray-100 shadow-lg rounded-2xl mt-10 p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Your Profile
        </h2>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">Email</label>
          <input
            onChange={(e) => setGmail(e.target.value)}
            value={gmail}
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-1">Address</label>
          <input
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={changeInfo}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition duration-200"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Profile;
