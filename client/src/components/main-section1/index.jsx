import React from "react";
import "./App.css";
import Robo from "./Robo-3d";

const Section1 = () => {
  return (
    <>
    
    <div className="section1-bg w-full h-full flex flex-col md:flex-row justify-between px-6 md:px-20 mb-20">
      
      <div className="flex flex-col items-center md:items-start md:ml-16">
        <h1 className="text-2xl md:text-4xl font-bold mt-4 md:mt-24">
          HI BOT,
        </h1>
        
        <h1 className="text-2xl md:text:block md:text-4xl font-bold mt-4 text-black">
          TECH MAGAZINE WITH THE COOLEST IDEAS. JOIN THE NEXT-LEVEL TECH, FROM QUANTUM COMPUTING TO AI. MIND-BOGGLING IDEAS TO GET YOU OUT OF YOUR TECH SLUMP!
        </h1>
        <h1 className="text-2xl md:text-4xl font-bold mt-4 text-black">
          HAVE SOMETHING AMAZING TO SHARE?
        </h1>
        <h1 className="text-xl md:text-2xl font-bold mt-2 font-color-1">
          WE WOULD LOVE TO HEAR FROM YOU!
        </h1>
        <button
          className="w-full md:w-1/4 p-3 rounded-3xl mt-4 border-2 border-black"
          style={{ backgroundColor: "#00E0EE" }}
        >
          GET STARTED
        </button>
      </div>
      
     
      
    </div>
   
    </>
  );
};

export default Section1;
