// Footer.jsx
import React from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full h-20 flex flex-row justify-center items-center mt-8 space-x-4 bg-black">
      <a href="https://www.linkedin.com" className="text-green-600">
        <FaLinkedin size={24} />
      </a>
      <a href="mailto:info@example.com" className="text-green-600">
        <FaEnvelope size={24} />
      </a>
      <div className="text-sm text-gray-500 mt-4">
        &copy; 2024 | Inside Bot Street
      </div>
    </div>
  );
};

export default Footer;
