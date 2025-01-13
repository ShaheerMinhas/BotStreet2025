import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown"; // For markdown rendering
import Navbar from "../../components/Navbar";
import LogoDiv from "../../components/LogoDiv";
import FollowUs from "../../components/ArticlePage/FollowUs";
import EmptyList from "../../common/EmptyList";
import "./App.css";

// Function to handle content formatting based on asterisks
const breakLinesOnAsterisks = (content) => {
  if (!content) return [];
  return content.split(/\#\#/).map((line, index) => ({
    text: line.trim(),
    isBold: index % 2 !== 0, // Every other section (odd indices) is bold
  }));
};

function ArticlePage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(false); // To handle API call errors

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/articlesfetch/getarticles/${id}`) // Using local server URL
      .then((res) => {
        setBlog(res.data);
        console.log('HERE')
        setError(false); // Reset error state if data is fetched successfully
      })
      .catch((err) => {
        console.error(err);
        setError(true); // Set error state if API call fails
      });
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <LogoDiv />
      <div className="article-container">
        <Link className="blog-goBack" to="/">
          <span> &#8592;</span> <span>Go Back</span>
        </Link>

        {/* Handle API call errors */}
        {error ? (
          <div className="error-message">Failed to load article. Please try again later.</div>
        ) : (
          blog && (
            <>
              <div className="title-image-container">
                <div className="colored-block">
                  <div className="text-container">
                    <h1 className="hero-title">{blog.title}</h1>
                    <p className="hero-date">Published {formatDate(blog.created_at)}</p>
                  </div>
                </div>
                <div className="white-block">
                  <div className="dots-overlay"></div>
                </div>
                {blog.image && blog.image[0] && (
                  <img src={blog.image} alt="cover" className="floating-image" />
                )}
              </div>

              {/* Three-column text layout */}
              <div className="content-section">
                {breakLinesOnAsterisks(blog.content).map((line, index) => (
                  <p
                    key={index}
                    style={{
                      fontWeight: line.isBold ? "bold" : "normal",
                    }}
                  >
                    {line.text}
                  </p>
                ))}
              </div>
            </>
          )
        )}
      </div>
      <FollowUs />
    </>
  );
}

export default ArticlePage;
