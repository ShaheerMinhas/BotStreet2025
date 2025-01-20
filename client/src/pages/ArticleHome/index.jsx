import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogItem from "../../components/main-section3/blogitem"; // Assuming you are using this component to render each article
import LogoDiv from "../../components/LogoDiv"; // Assuming this is your logo component

const ArticlesHome = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    "http://localhost:3000/api/articles/get-articles" ||
    "https://botstreet2025.onrender.com/api/articles/get-articles";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <LogoDiv />
      <div className="max-w-6xl mx-auto p-4">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">ARTICLES</h1>
          <p className="text-gray-600 mt-2">Discover our latest articles on various topics.</p>
        </header>

        {/* Articles Listing */}
        <div className="space-y-6">
          {loading ? (
            <div>Loading...</div> // Display loading text while fetching articles
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="w-full">
                <BlogItem blog={blog} /> {/* Use the BlogItem component for each article */}
              </div>
            ))
          )}
        </div>

        {/* View More Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-black text-white font-bold py-2 px-4 rounded w-80">
            View More
          </button>
        </div>
      </div>
    </>
  );
};

export default ArticlesHome;
