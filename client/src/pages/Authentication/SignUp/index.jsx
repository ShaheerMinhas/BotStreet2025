import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Robo from '../../../components/main-section1/Robo-3d';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Using useNavigate hook for navigation
  const backgroundImageUrl = '/assets/authbg.jpg';

  // Define API URL based on environment
  const API_BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://botstreet2025.onrender.com';
  const API_URL = `${API_BASE_URL}/api/auth/register`;

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Append the .nu.edu.pk domain to the email if not already present
    let userEmail = email.trim();
    if (!userEmail.endsWith('.nu.edu.pk')) {
      userEmail += '.nu.edu.pk';
    }

    // Validation
    if (!username || !userEmail || !password) {
      setError('All fields are required.');
      return;
    }

    // Clear error if validation passes
    setError(null);

    try {
      // Send request to register the user and get OTP
      const response = await axios.post(API_URL, {
        name: username,
        email: userEmail,
        password,
      });

      // On success, store email and navigate to OTP page
      localStorage.setItem('userEmail', userEmail);
      navigate('/otp'); // Navigating to OTP verification page

    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong!');
    }
  };

  return (
    <div
      className="bg flex justify-center items-center"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
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
              Sign Up to Join Our Community
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSignUp}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} 
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Your email will be automatically appended with @nu.edu.pk.</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-fuchsia-900 hover:bg-blue-700 text-white font-color-1 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
