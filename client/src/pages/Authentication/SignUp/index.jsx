import React, { useState } from 'react';
import Robo from '../../../components/main-section1/Robo-3d';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Define error state
  const backgroundImageUrl = "/assets/authbg.jpg";

  const handleSignUp = (e) => {
    e.preventDefault();
    
    // Example validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // Clear error if validation passes
    setError(null);

    // Handle sign-up logic
    console.log("Signed up:", { username, email, password });
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

          {/* Sign-Up Form Section */}
          <div className='ml-12'>
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
                  onChange={(e) => setUsername(e.target.value)} // Update state
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
                  onChange={(e) => setEmail(e.target.value)} // Update state
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
                  onChange={(e) => setPassword(e.target.value)} // Update state
                  required
                />
              </div>
              <p className="text-gray-700 text-sm mb-4">By signing up you are agreeing to our terms and conditions</p>
              <div className="flex items-center justify-between">
                <button
                  className="bg-fuchsia-900 hover:bg-blue-700 text-white font-color-1 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
