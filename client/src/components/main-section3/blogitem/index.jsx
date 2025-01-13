import React from "react";
import { Link } from "react-router-dom";

const BlogItem = ({
  blog: {
    id,title,
    description,
    content,
    created_at,
    authorName,
    authorAvatar,
    image,
    category,
  },
}) => {
  const linkStyle = {
    textDecoration: "none", // Remove underline
    color: "inherit", // Inherit text color from parent
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
    
  };

  return (
    <Link className="blogItem-wrap" to={`/blog/${id}`} style={linkStyle}>
      <div className="flex flex-col sm:flex-row bg-white overflow-hidden mb-6 border-b pb-8 border-gray-300">
        {/* Left: Cover Image */console.log(image)}
        <div className="w-full sm:w-3/12 flex-shrink-0">
          {image && image[0] && (
            <img
              className="h-44 w-full sm:w-64 object-cover p-2"
              src={image} // Assuming first image in the array
              alt={title}
            />
           
          )}
        </div>

        {/* Right: Content */}
        <div className="w-full sm:w-9/12 pt-2 sm:pl-4">
          {/* Article Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

          {/* Metadata */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            {/* Author Avatar */}
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-8 w-8 rounded-full mr-2"
              />
            )}
            <span className="mr-2">By {authorName || "Unknown"}</span>
            <span>&#x2022;</span>
            <span className="ml-2">{formatDate(created_at)}</span>
          </div>

          {/* Description */}
          <p className="text-left text-sm text-gray-500 mb-4">
            {description || "No description available."}
          </p>

          {/* Interaction Icons */}
          <div className="flex items-center text-gray-600 space-x-4">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              Like
            </span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
              Bookmark
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogItem;
