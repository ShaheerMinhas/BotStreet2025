import React from 'react';

const Form = () => {
  return (
    <div className="flex justify-center items-center">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl p-4">
        <div className="flex flex-col space-y-4 md:col-span-1">
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 border-2 border-black"
          />
          <input
            type="text"
            placeholder="Subject"
            className="border p-2 border-2 border-black"
          />
          <input
            type="text"
            placeholder="Contact Number"
            className="border p-2 border-2 border-black"
          />
        </div>
        <div className="flex flex-col space-y-4 md:col-span-1">
          <input
            type="email"
            placeholder="Email Address"
            className="border p-2 border-2 border-black"
          />
          <textarea
            placeholder="Your Message"
            className="border p-2 border-2 border-black h-32"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-purple-500 text-white p-2 border-2 hover:border-indigo hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      
    </div>
  );
};

export default Form;
