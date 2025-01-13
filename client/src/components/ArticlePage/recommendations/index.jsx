import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import BlogList from "../../main-section3/bloglist";
import RecList from "../RecList";

function Recommendations() {
  const [blogList, setblogList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("https://botbackend1-0.onrender.com/articles")
      .then((res) => {
        setblogList(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className="flex flex-col items-center justify-center  bg-purple p-6 space-y-16">
        <div className="text-3xl font-extrabold mb-1 text-white border-b-8 border-teal-400">
          Recommendations
        </div>
        
          {console.log(blogList)}
          <RecList blogs={blogList} />
        
        <button className="bg-black text-white font-bold py-2 px-4 rounded">
          View More
        </button>
      </div>
    </>
  );
}

export default Recommendations;
