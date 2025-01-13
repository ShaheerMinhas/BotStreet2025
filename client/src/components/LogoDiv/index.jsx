import React, { useState } from 'react';
import logo from "./logo.png"; // Adjust the path based on your folder structure
import MobileNav from '../MobileNav';
import { Link } from 'react-router-dom';

function LogoDiv() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white">
      <div className="container mx-auto flex justify-between items-center pt-2 px-6 md:border-0 border-b-2 border-black">
        
        {/* Logo on the left */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="md:h-16 md:w-56 h-8 w-28 md:border-0 mr-3" />
        </div>

        {/* Hamburger Menu for Mobile */}
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

        {/* Full Menu (hidden on mobile) */}
        <nav className="hidden lg:flex space-x-8">
          <div className="border-2 border-black mr-16 pt-6 pb-6">
          <Link to="/"> <a href="#" className="text-gray-600 hover:text-gray-900 p-6 border-r-2 border-black">H o m e</a></Link> 
            <a href="#" className="text-gray-600 hover:text-gray-900 p-6 border-r-2 border-black">A b o u t U s</a>
            <Link to="/articles"><a href="#" className="text-gray-600 hover:text-gray-900 p-6 border-r-2 border-black">A r t i c l e s</a></Link>
            <Link to="/publish"><a href="#" className="text-gray-600 hover:text-gray-900 p-6 border-r-2 border-black">P u b l i s h</a></Link>
           <a href="#" className="text-gray-600 hover:text-gray-900 p-6 border-r-2 border-black">C o n t a c t U s</a>
           <Link to='/signin'> <a href="#" className="text-white hover:text-gray-900 bg-black p-6">Login</a></Link>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && <MobileNav toggleMenu={toggleMenu} />}
    </header>
  );
}

export default LogoDiv;
