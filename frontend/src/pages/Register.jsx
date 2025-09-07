import React, { useEffect } from 'react'
import { useContext, useState } from 'react';
import { WarpBackground } from "@/components/magicui/warp-background";
import { Link, useNavigate} from 'react-router-dom';
import { ComicText } from "@/components/magicui/comic-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import toast from 'react-hot-toast';
import axios from 'axios';
import { UserInfo } from '@/context/AuthContext';
 


const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const {authUser, setAuthUser} = useContext(UserInfo);


  const handlesubmit = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`,{name, gmail, password, address, role:"customer"}, { withCredentials: true });
          if(res.data.success){
            setAuthUser(res.data.user);
            toast.success(res.data.message);
            navigate("/");
          } else {
            toast.error(res.data.message);
          }
      } catch (error) {
        console.error("Error during register:", error);
      }
}

  return (
    <WarpBackground className="h-screen w-screen flex items-center justify-center bg-gray-200">
      <div className="backdrop-blur-sm p-8 rounded-2xl shadow-lg w-[350px] space-y-4 border-2">
        <ComicText fontSize={2}>Register</ComicText>
        <br />
        <input onChange={(e) => setName(e.target.value)}  value={name} name="name" type="text" placeholder="Enter your name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input onChange={(e) => setGmail(e.target.value)}  value={gmail} name="gmail" type="email" placeholder="Enter your Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input onChange={(e) => setPassword(e.target.value)} value={password} name="password" type="password" placeholder="Enter your Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <input onChange={(e) => setAddress(e.target.value)} value={address} name="address" type="text" placeholder="Enter your Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <br />
        <div className="flex justify-center">
          <ShimmerButton className="text-center h-xl w-xl" onClick={handlesubmit}>Submit</ShimmerButton>
        </div>
        <div className="text-sm text-center text-gray-600">
          Already registered ?{' '}
          <Link to="/signin" className="text-blue-500 hover:underline">SignIn</Link>
        </div>
      </div>
    </WarpBackground>
  )
}

export default Register
