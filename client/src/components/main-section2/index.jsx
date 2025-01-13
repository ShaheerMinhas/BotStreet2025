import React from "react";
import "./App.css";
const Section2 = () => {
  return (
    <div className="flex flex-row w-full bg-black div-height">
      <div className="h-full w-0 md:w-2/5 back-color">
        <h1
          className="text-white text-5xl font-bold mt-16 md:mt-60 ml-20 md:ml-40 mr-16"
          style={{ color: "#BDFF00" }}
        >
          About Us
        </h1>
      </div>
      <p className="text-white text-xl mt-60 md:ml-40 text-center">
        At Bot Street, we offer a blend of insightful articles and engaging
        audio &shy;conent by delving into the heart of technical research,
        ensuring you stay informed and inspired in the world of
      </p>
    </div>
  );
};

export default Section2;
