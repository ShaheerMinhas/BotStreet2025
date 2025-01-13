// BlogList.jsx
import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import BlogItem from "../../main-section3/blogitem";


const RecList = ({ blogs }) => {

  return (
    <div>
      {blogs.slice(0,3).map((blog) => (
        <div key={blog.id} className="p-4">
          <BlogItem blog={blog} />
        </div>
      ))}
    </div>
  );
};

export default RecList;
