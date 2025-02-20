import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const BlogItem = ({
  blog: {
    id,
    title,
    description,
    created_at,
    author_name,
    authorAvatar,
    image,
    user_id, // This is the blog author's user ID
  },
}) => {
  const navigate = useNavigate();
  const [user_Id, setUserId] = useState(null); // Store logged-in user's ID
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://botstreet2025.onrender.com";
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // No token, user is not logged in

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/islogin`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId); // ✅ Store user ID
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    fetchUser();
  }, []);

  // Log user_Id only when it updates
  useEffect(() => {
    console.log("Updated user_Id:", user_Id);
  }, [user_Id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link to={`/blog/${id}`} className="blogItem-wrap">
      <div className="flex flex-col sm:flex-row bg-white overflow-hidden mb-6 border-b pb-8 border-gray-300">
        {/* Left: Cover Image */}
        <div className="w-full sm:w-3/12 flex-shrink-0">
          {image && (
            <img className="h-44 w-full sm:w-64 object-cover p-2" src={image} alt={title} />
          )}
        </div>

        {/* Right: Content */}
        <div className="w-full sm:w-9/12 pt-2 sm:pl-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

          {/* Metadata */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            {authorAvatar && (
              <img src={authorAvatar} alt={author_name} className="h-8 w-8 rounded-full mr-2" />
            )}
            <span className="mr-2">By {author_name || "Unknown"}</span>
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

            {/* Edit Button (Only show if logged-in user is the author) */}
            {user_Id && user_Id === user_id && (
              <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/edit/${id}`);
              }}
              className="flex items-center cursor-pointer text-gray-700 hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 mr-1"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit
            </button>
          )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogItem;
