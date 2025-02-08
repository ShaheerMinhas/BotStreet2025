import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditArticle = () => {
  const { id } = useParams(); // Get article ID from URL
  console.log("Editing article ID:", id);
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorLinkedIn, setAuthorLinkedIn] = useState("");
  const [titleImageUrl, setTitleImageUrl] = useState("");
  const [articleImages, setArticleImages] = useState([]);

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    // Fetch article data
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/articles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setContent(data.content);
          setDescription(data.description);
          setAuthorName(data.author_name);
          setAuthorLinkedIn(data.author_linkedin);
          setTitleImageUrl(data.image);
          setArticleImages(data.article_images || []);
        } else {
          alert("Failed to fetch article data");
        }
      } catch (error) {
        alert("Error fetching article: " + error.message);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          description,
          author_name: authorName,
          author_linkedin: authorLinkedIn,
          image: titleImageUrl,
          article_images: articleImages,
        }),
      });

      if (response.ok) {
        alert("Article updated successfully!");
        navigate("/");
      } else {
        alert("Error updating article");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  }), []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-center mb-8">Edit Article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-4 border-2" placeholder="Article Title"/>
        <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required className="w-full p-4 border-2" placeholder="Author Name"/>
        <input type="url" value={authorLinkedIn} onChange={(e) => setAuthorLinkedIn(e.target.value)} required className="w-full p-4 border-2" placeholder="LinkedIn"/>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-4 border-2" placeholder="Description (max 100 words)"/>
        <ReactQuill ref={quillRef} value={content} onChange={setContent} modules={modules} className="border-2" />
        <button type="submit" className="w-full py-3 bg-blue-600 text-white">Update Article</button>
      </form>
    </div>
  );
};

export default EditArticle;
