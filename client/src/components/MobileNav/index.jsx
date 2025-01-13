import React from 'react';
import mobileNavBG from './mobileNavBG.jpeg'; // Import the image
import logo from "./logo.png";
import { Link } from 'react-router-dom'
function MobileNav({ toggleMenu }) {
  return (
    <div 
      className="fixed inset-0 text-white flex flex-col justify-center items-center z-50" 
      style={{ 
        backgroundImage: `url(${mobileNavBG})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
       <img src={logo} alt="Logo" className="h-16 w-56 md:border-0 mr-3" />
      <button 
        onClick={toggleMenu} 
        className="absolute top-6 right-6 text-black text-3xl"
      >
        &times;
      </button>

      <nav className="text-center space-y-6 text-2xl">
        <a href="#" className="block text-black border-t-2">H o m e</a>
        <a href="#" className="block text-black">A b o u t U s</a>
        <a href="#" className="block text-black">A r t i c l e s</a>
        <a href="#" className="block text-black" >C o n t a c t U s</a>
        <Link to='/signin'><a href="#" className="block bg-white border-b-2 text-black px-4 py-2">Login</a></Link>
      </nav>
    </div>
  );
}

export default MobileNav;
