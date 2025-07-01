import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Robo from '../../../components/main-section1/Robo-3d';

const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://botstreet2025.onrender.com';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const backgroundImageUrl = '/assets/authbg.jpg';

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/send-otp`, { email: email.trim() });
      localStorage.setItem('userEmail', email.trim());
      setShowOtpPopup(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const otpValue = otp.join('');
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email,
        otp: otpValue,
      });

      if (response.data.message === 'OTP verified successfully') {
        setOtpVerified(true);
        await new Promise((res) => setTimeout(res, 1000));
        await axios.post(`${API_BASE_URL}/api/auth/register`, {
          name: username,
          email,
          password,
        });
        setShowOtpPopup(false);
        setTimeout(() => navigate('/signin'), 500);
      } else {
        setError('Invalid OTP.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg flex justify-center items-center transition-all duration-500"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-8 flex transition-transform duration-500 transform hover:scale-105">
        <div className="w-1/3 flex justify-center items-center hidden sm:flex">
          <Robo />
        </div>
        <div className="border-r border-gray-300 mx-4 hidden sm:flex"></div>
        <div className="w-2/3">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/Logo-removebg-preview.png"
              alt="Logo"
              className="w-24 h-24 transition-transform duration-500 transform hover:rotate-6"
            />
          </div>
          <div className="ml-12">
            <h1 className="text-xl md:text-2xl font-bold mt-2 mb-4 font-color-1">Sign Up</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleContinue}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:ring-2 focus:ring-fuchsia-900 transition-all duration-300"
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
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:ring-2 focus:ring-fuchsia-900 transition-all duration-300"
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
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:ring-2 focus:ring-fuchsia-900 transition-all duration-300"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-row items-center mt-4 mb-4">
              <p className="text-gray-700 text-sm">Already have an account?</p>
              <Link to="/signin" className="ml-2 text-purple-900">Sign In</Link>
            </div>
              <button
                className="bg-fuchsia-900 text-white font-bold py-2 px-4 rounded w-full hover:bg-fuchsia-800 transition-colors duration-300"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Loading'
                ) : (
                  'Continue'
                )}
              </button>
            </form>
          

            {showOtpPopup && (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 transition-opacity duration-500 z-50">
                <div className="bg-white p-8 rounded-2xl shadow-2xl transform transition-transform duration-500 scale-95 hover:scale-100 w-full max-w-md relative">
                  {!otpVerified ? (
                    <>
                      <h2 className="text-2xl font-bold mb-6 text-center text-fuchsia-900">Verify OTP</h2>
                      <form>
                        <label className="block text-gray-700 text-sm font-bold mb-4 text-center">
                          Enter the 4-digit OTP sent to your email
                        </label>
                        <div className="flex justify-center gap-4 mb-6">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              className="w-14 h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-fuchsia-500 focus:border-fuchsia-700 transition-all duration-200"
                              type="text"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              required
                            />
                          ))}
                        </div>
                        <button
                          className="bg-fuchsia-900 text-white font-bold py-3 px-6 rounded w-full hover:bg-fuchsia-800 transition-colors duration-300"
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-green-600 text-6xl animate-bounce mb-4">✓</div>
                      <h2 className="text-2xl font-semibold text-center text-green-800 mb-2">OTP Verified!</h2>
                      <p className="text-center text-gray-600">Congratulations! Redirecting...</p>
                    </div>
                  )}
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
