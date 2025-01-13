import React from "react";
import Form from "./form";
import Footer from "../footer";
import "./App.css";
const Contact = () => {
  return (
    <div>
      <div className="w-full h-0.5 line-color"></div>
      <div className="flex flex-col items-center justify-center  bg-white p-6">
        <h1 className="text-5xl font-extrabold mb-1">LET'S CONNECT</h1>
        <p className="text-center text-xl font-light mb-8">
          We're genuinely interested in learning more about your project. Feel
          free to share your details in the form below to get started.
        </p>
        <Form />
      </div>
    </div>
  );
};

export default Contact;
