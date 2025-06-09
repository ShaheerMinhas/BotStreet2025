import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BlogList from "./bloglist";
import "./App.css";

function Articles() {
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://botstreet2025.onrender.com";

  useEffect(() => {
    axios
      .get(`https://botstreet2025.onrender.com/api/articles/get-articles`)
      .then((res) => {
        // Sort articles by created_at (most recent first) and take only 2 articles
        const sortedArticles = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 2);

        setBlogList(sortedArticles);
        setLoading(false);
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
          <div>Loading...</div>
        ) : (
          <BlogList blogs={blogList} />
        )}

        <div className="flex justify-center">
          <Link to="/articles">
            <button className="bg-black text-white font-bold py-2 px-4 rounded w-80">
              View More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Articles;
