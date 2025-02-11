import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "./logo.png"; // Adjust path accordingly
import MobileNav from '../MobileNav';

function LogoDiv() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // No token, user is not logged in

      try {
        const response = await fetch('http://localhost:3000/api/auth/islogin', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ username: data.name });
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white">
      <div className="container mx-auto flex justify-between items-center pt-2 px-6 md:border-0 border-b-2 border-black">
        
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="md:h-16 md:w-56 h-8 w-28 md:border-0 mr-3" />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button 
            onClick={toggleMenu} 
            className="text-gray-600 focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-8">
          <div className="border-2 border-black flex items-center pt-6 pb-6 px-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900 px-6 border-r-2 border-black">H o m e</Link>
            <Link to="/articles" className="text-gray-600 hover:text-gray-900 px-6 border-r-2 border-black">A r t i c l e s</Link><Link 
  to={user ? "/publish" : "/signin"} 
  className="text-gray-600 hover:text-gray-900 px-6 border-r-2 border-black"
>
  P u b l i s h
</Link>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-6 border-r-2 border-black">C o n t a c t U s</a>

            {/* Show username if logged in, else show login button */}
            {user ? (
              <div className="flex items-center px-6">

<span className="text-gray-600 font-semibold">{user.username}</span>
                <img 
                  src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" 
                  alt="User" 
                  className="w-8 h-8 rounded-full ml-4" 
                />
              </div>
            ) : (
              <Link to='/signin' className="text-black font-extrabold hover:text-gray-900  px-6 py-2 ml-2">LOG IN</Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && <MobileNav toggleMenu={toggleMenu} />}
    </header>
  );
}

export default LogoDiv;
