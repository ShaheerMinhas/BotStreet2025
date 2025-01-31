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
  const paragraphSeparator = "##"; // Define the paragraph separator
  const paragraphs = content.split(paragraphSeparator); // Split content into paragraphs

  return paragraphs.map((paragraph) => {
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g; // Matches text between ** and **
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(paragraph)) !== null) {
      // Push text before the match
      if (match.index > lastIndex) {
        parts.push({ text: paragraph.substring(lastIndex, match.index), isBold: false });
      }
      // Push the matched bold text
      parts.push({ text: match[1], isBold: true });
      lastIndex = regex.lastIndex;
    }

    // Push remaining text after the last match
    if (lastIndex < paragraph.length) {
      parts.push({ text: paragraph.substring(lastIndex), isBold: false });
    }

    return parts;
  });
};

function ArticlePage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(false); // To handle API call errors

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://botstreet2025.onrender.com";

  const API_URL = `${API_BASE_URL}/api/articlesfetch/getarticles/${id}`;

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setBlog(res.data);
        console.log("HERE");
        setError(false); // Reset error state if data is fetched successfully
      })
      .catch((err) => {
        console.error(err);
        setError(true); // Set error state if API call fails
      });
  }, [API_URL]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <LogoDiv />
      <div className="article-container">
        <div className="header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link className="blog-goBack" to="/">
            <span>&#8592;</span> <span>Go Back</span>
          </Link>
          {blog?.author_name && blog?.author_linkedin && (
            <a
              className="author-name"
              href={blog.author_linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "blue" }}
            >
              <span style={{ marginRight: "5px" }}>Author:</span>
              {blog.author_name}
            </a>
          )}
        </div>

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

              {/* Render content with paragraphs and bold phrases */}
              <div className="content-section">
                {breakLinesOnAsterisks(blog.content).map((lineParts, paragraphIndex) => (
                  <p key={paragraphIndex}>
                    {lineParts.map((part, partIndex) => (
                      <span
                        key={partIndex}
                        style={{
                          fontWeight: part.isBold ? "bold" : "normal",
                        }}
                      >
                        {part.text}
                      </span>
                    ))}
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
