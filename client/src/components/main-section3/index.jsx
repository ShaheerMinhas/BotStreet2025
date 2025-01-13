import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogList from "./bloglist"; // Assuming this is the component to render the articles
import './App.css';

function Articles() {
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles when the component mounts
  useEffect(() => {
    // Update the URL to your local API endpoint
    axios
      .get("http://localhost:3000/api/articles/get-articles") // API call to localhost server
      .then((res) => {
        setBlogList(res.data); // Store fetched articles in the state
        setLoading(false); // Set loading to false once data is fetched
        console.log(res.data); // Log the fetched data (can be removed later)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="border">
      <div className="flex flex-col p-6 space-y-16">
        <div className="flex justify-between items-center">
          <div className="text-4xl text-black font-bold mb-1 border-teal-400 text-left">
            FEATURED ARTICLES
          </div>
        </div>

        {loading ? (
          <div>Loading...</div> // Show loading message while articles are being fetched
        ) : (
          <BlogList blogs={blogList} /> // Pass the fetched articles to BlogList component
        )}

        <div className="flex justify-center">
          <button className="bg-black text-white font-bold py-2 px-4 rounded w-80">
            View More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Articles;
