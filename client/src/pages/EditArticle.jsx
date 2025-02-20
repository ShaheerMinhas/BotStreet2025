import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditArticle = () => {
  const { id } = useParams(); // Get article ID from URL
  const navigate = useNavigate();
  const quillRef = useRef(null);

  // State variables
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorLinkedIn, setAuthorLinkedIn] = useState("");
  const [titleImageUrl, setTitleImageUrl] = useState("");
  const [articleImages, setArticleImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://botstreet2025.onrender.com";

  // Fetch article details
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/articles/articles/${id}`);
        if (!response.ok) throw new Error("Failed to fetch article");
        const data = await response.json();

        setTitle(data.title);
        setContent(data.content);
        setDescription(data.description);
        setAuthorName(data.author_name);
        setAuthorLinkedIn(data.author_linkedin);
        setTitleImageUrl(data.image);
        setArticleImages(data.article_images || []);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchArticle();
  }, [id]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
  
    if (!title || !content || !authorName) {
      setError("Title, content, and author name are required!");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/update/${id}`, {
        method: "POST", // ✅ Ensure backend allows POST for updates (or change to PUT)
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
  
      if (!response.ok) throw new Error("Error updating article");
  
      alert("Article updated successfully!");
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleLink = () => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    if (range) {
      const existingLink = editor.getFormat(range).link;
      const url = prompt("Enter the URL", existingLink || "http://");
      if (url) {
        editor.format("link", url);
      }
    }
  };

  // ReactQuill toolbar options
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-8">Edit Article</h1>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-4 border rounded"
          placeholder="Article Title"
        />
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
          className="w-full p-4 border rounded"
          placeholder="Author Name"
        />
        <input
          type="url"
          value={authorLinkedIn}
          onChange={(e) => setAuthorLinkedIn(e.target.value)}
          className="w-full p-4 border rounded"
          placeholder="LinkedIn (Optional)"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full p-4 border rounded"
          placeholder="Short Description (Max 100 words)"
        />
        
        {/* Article Content (Quill Editor) */}
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          className="border rounded"
        />

        <input
          type="url"
          value={titleImageUrl}
          onChange={(e) => setTitleImageUrl(e.target.value)}
          className="w-full p-4 border rounded"
          placeholder="Title Image URL"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update Article"}
        </button>
      </form>
    </div>
  );
};

export default EditArticle;
