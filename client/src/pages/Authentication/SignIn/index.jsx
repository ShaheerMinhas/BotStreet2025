import React, { useState } from 'react';
import Robo from '../../../components/main-section1/Robo-3d';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const backgroundImageUrl = "/assets/authbg.jpg";

  const API_BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api/auth/login'
      : 'https://botstreet2025.onrender.com/api/auth/login';

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save the token (You can store it in localStorage or sessionStorage)
      localStorage.setItem('token', data.token);

      // Redirect to a protected route
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className='bg flex justify-center items-center'
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-8 flex">
        {/* Robo Section */}
        <div className="w-1/3 flex justify-center items-center hidden sm:flex">
          <Robo />
        </div>

        {/* Divider between Robo and Form */}
        <div className="border-r border-gray-300 mx-4 hidden sm:flex"></div>

        {/* Form and Logo Section */}
        <div className="w-2/3">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <img
              src="/assets/Logo-removebg-preview.png"
              alt="Logo"
              className="w-24 h-24"
            />
          </div>

          {/* Sign-In Form Section */}
          <div className='ml-12'>
            <h1 className="text-xl md:text-2xl font-bold mt-2 mb-4 font-color-1">
              Sign In
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSignIn}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
             
              <div className="mb-6">
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

              <div className="flex flex-row items-center mb-4">
                <p className="text-gray-700 text-sm">Don't have an account?</p>
                <Link to='/signup' className="ml-2 text-purple-900">Sign Up</Link>
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-fuchsia-900 hover:bg-blue-700 text-white font-color-1 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
