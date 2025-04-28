import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Robo from '../../../../components/main-section1/Robo-3d';
function OTPPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Using useNavigate hook for navigation
  const email = localStorage.getItem('userEmail'); // Get the email from local storage

  useEffect(() => {
    if (!email) {
      navigate('/signup'); // Redirect to sign-up page if no email is found
    }
  }, [email, navigate]);

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError('OTP is required.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Send OTP validation request
      const response = await axios.post('/api/auth/verify-otp', {
        email,
        otp,
      });

      // On success, navigate to the home page or dashboard
      setIsLoading(false);
      navigate('/home');
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.error || 'Something went wrong!');
    }
  };

  return (
    <div
      className="bg flex justify-center items-center"
      style={{
        backgroundImage: `url('/assets/authbg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-8 flex">
        {/* Robo Section */}
        <div className="w-1/3 flex justify-center items-center hidden sm:flex">
          <Robo />
        </div>

        {/* Divider */}
        <div className="border-r border-gray-300 mx-4 hidden sm:flex"></div>

        {/* Form Section */}
        <div className="w-2/3">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/Logo-removebg-preview.png"
              alt="Logo"
              className="w-24 h-24"
            />
          </div>

          <div className="ml-12">
            <h1 className="text-xl md:text-2xl font-bold mt-2 mb-4 font-color-1">
              Verify Your OTP
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleOTPSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                  OTP
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-fuchsia-900 hover:bg-blue-700 text-white font-color-1 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPPage;
