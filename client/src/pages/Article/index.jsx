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
  const paragraphSeparator = "##"; // Define paragraph separator
  const paragraphs = content.split(paragraphSeparator); // Split content into paragraphs

  return paragraphs.map((paragraph) => {
    const parts = [];
    const regex = /(\*\*(.*?)\*\*)|(<img\s+src=["'](.*?)["'].*?>)|(<a\s+href=["'](.*?)["'].*?>(.*?)<\/a>)/g; // Matches **bold** text and <img> tags
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(paragraph)) !== null) {
      // Push text before the match
      if (match.index > lastIndex) {
        parts.push({
          text: paragraph.substring(lastIndex, match.index),
          isBold: false,
          isImage: false,
          isLink: false,
        });
      }

      if (match[1]) {
        // Bold text found
        parts.push({
          text: match[2], // Extract bold text
          isBold: true,
          isImage: false,
          isLink: false,
        });
      } else if (match[3]) {
        // Image found
        parts.push({
          imageUrl: match[4], // Extract image URL
          isBold: false,
          isImage: true,
          isLink: false,
        });
      }else if (match[5]) {
        parts.push({ linkUrl: match[6], linkText: match[7], isBold: false, isImage: false, isLink: true });
      }

      lastIndex = regex.lastIndex;
    }

    // Push remaining text after the last match
    if (lastIndex < paragraph.length) {
      parts.push({
        text: paragraph.substring(lastIndex),
        isBold: false,
        isLink: false,
        isImage: false,
      });
    }

    return parts;
  });
};

function ArticlePage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(false);
  const [imageHeight, setImageHeight] = useState(0);
  const [isTallImage, setIsTallImage] = useState(false);
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://botstreet2025-production.up.railway.app/";

  const API_URL = `${API_BASE_URL}/api/articlesfetch/getarticles/${id}`;

  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        setBlog(res.data);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [API_URL]);

  useEffect(() => {
    if (blog?.image) {
      const img = new Image();
      img.src = blog.image;
      img.onload = () => {
        setImageHeight(img.height);
        setIsTallImage(img.height > 500);
      };
    }
  }, [blog?.image]);

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
              href={blog.author_linkedin.startsWith("http") ? blog.author_linkedin : `https://${blog.author_linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "blue" }}
            >
              <span style={{ marginRight: "5px" }}>Author:</span>
              {blog.author_name}
            </a>
          )}
        </div>

        {error ? (
          <div className="error-message">Failed to load article. Please try again later.</div>
        ) : (
          blog && (
            <>
              <div className="title-image-container" style={{ marginTop: isTallImage ? "50px" : "0px" }}>
                <div className="colored-block">
                  <div className="text-container">
                    <h1 className="hero-title">{blog.title}</h1>
                    <p className="hero-date">Published {formatDate(blog.created_at)}</p>
                  </div>
                </div>
                <div className="white-block">
                  <div className="dots-overlay"></div>
                </div>
                {blog.image && (
                  <img
                    src={blog.image}
                    alt="cover"
                    className="floating-image"
                    style={{ maxWidth: "100%", height: "auto", objectFit: isTallImage ? "contain" : "cover", maxHeight: "500px" }}
                  />
                )}
              </div>
              
              {/* Render content with paragraphs and bold phrases */}
              <div className="content-section">
                {breakLinesOnAsterisks(blog.content).map(
                  (lineParts, paragraphIndex) => (
                    <div key={paragraphIndex}>
                      {" "}
                      {/* Use div instead of auto-wrapping in <p> */}
                      {lineParts.map((part, partIndex) =>
                        part.isImage ? (
                          <img
                            key={partIndex}
                            src={part.imageUrl}
                            alt="Article Content"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              margin: "10px 0",
                              display: "block",
                            }}
                          />
                        ) : part.isLink ? (
                          <a key={partIndex} href={part.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
                            {part.linkText}
                          </a>
                        ):(
                          <span
                            key={partIndex}
                            style={{
                              fontWeight: part.isBold ? "bold" : "normal",
                            }}
                            dangerouslySetInnerHTML={{ __html: part.text }} // Ensures proper HTML rendering
                          />
                        )
                      )}
                    </div>
                  )
                )}
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
