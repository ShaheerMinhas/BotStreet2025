import React, { useState, useEffect } from "react";
import BlogItem from "../blogitem";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Robo from "../../main-section1/Robo-3d";
Robo
const BlogList = ({ blogs }) => {
  const [displayCount, setDisplayCount] = useState(1); // Default to 1 for vertical list
  const navigate = useNavigate();
  useEffect(() => {
    const updateDisplayCount = () => {
      if (window.innerWidth <= 480) {
        setDisplayCount(1); // Display 1 blog item on small screens
      } else {
        setDisplayCount(1); // Still vertical on larger screens
      }
    };

    const handleClick = () => {
      navigate(`/blog/${blog.id}`);
    };
    // Set the initial value
    updateDisplayCount();

    // Add event listener
    window.addEventListener("resize", updateDisplayCount);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", updateDisplayCount);
  }, []);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col space-y-6 w-full lg:w-1/2">
        {blogs.map((blog) => (
          <div key={blog.id} className="w-full">
            <BlogItem blog={blog} />
          </div>
        ))}
      </div>
      {/* Robo component - hidden on phone devices */}
      <div className="hidden md:flex flex-col space-y-6 w-1/2">
        {/* Robo component is shown only on larger screens (lg and above) */}
        <Robo />
      </div>
    </div>
  );
};

export default BlogList;
