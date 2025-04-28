const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://botstreet2025.onrender.com';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Robo from '../../../components/main-section1/Robo-3d';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const navigate = useNavigate();
  const backgroundImageUrl = '/assets/authbg.jpg';

  // Handle sending OTP
  const handleContinue = async (e) => {
    e.preventDefault();
    let userEmail = email.trim();
   

    try {
      await axios.post(`${API_BASE_URL}/api/auth/send-otp`, { email: userEmail });
      localStorage.setItem('userEmail', userEmail);
      setShowOtpPopup(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send OTP.');
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    console.log("Trying from frontend verifying OTP");
    setIsLoading(true);
    try {
      console.log("Sending request to verify OTP...");
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, { email, otp });
      console.log("Full response received:", response);
  
      // Corrected condition
      if (response.data.message === 'OTP verified successfully') {
        console.log("OTP Verified! Registering user...");
        await axios.post(`${API_BASE_URL}/api/auth/register`, { name: username, email, password });
        navigate('/');
      } else {
        console.log("Invalid OTP response:", response.data);
        setError('Invalid OTP.');
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
      setError(error.response?.data?.error || 'OTP verification failed.');
    }finally {
      setIsLoading(false); // ✅ Always stop loading
    }
  };
  
  
  return (
    <div
      className="bg flex justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}
    >
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-8 flex">
        <div className="w-1/3 flex justify-center items-center hidden sm:flex">
          <Robo />
        </div>
        <div className="border-r border-gray-300 mx-4 hidden sm:flex"></div>
        <div className="w-2/3">
          <div className="flex justify-center mb-6">
            <img src="/assets/Logo-removebg-preview.png" alt="Logo" className="w-24 h-24" />
          </div>
          <div className="ml-12">
            <h1 className="text-xl md:text-2xl font-bold mt-2 mb-4 font-color-1">Sign Up</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleContinue}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="bg-fuchsia-900 text-white font-bold py-2 px-4 rounded w-full" type="submit">
                Continue
              </button>
            </form>

            {showOtpPopup && (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
                  <form>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP</label>
                    <input
                      className="shadow border rounded w-full py-2 px-3 text-gray-700"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <button
                      className="bg-fuchsia-900 text-white font-bold py-2 px-4 rounded mt-4 w-full"
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                    > {isLoading ? 'Verifying...' : 'Verify OTP'}
                      
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
