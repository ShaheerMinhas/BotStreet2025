import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'react-quill/dist/quill.snow.css';

const transformContent = (htmlContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Transform bold text to markdown format (**text**)
  doc.querySelectorAll('b, strong').forEach((boldElement) => {
    const parent = boldElement.parentNode;
    const transformedContent = `**${boldElement.textContent.trim()}**`;
    const textNode = document.createTextNode(transformedContent);
    parent.replaceChild(textNode, boldElement);
  });

  // Transform paragraphs to include '##' line breaks
  const transformedLines = [];
  doc.querySelectorAll('p').forEach((paragraph) => {
    const textContent = paragraph.textContent.trim();
    if (textContent) {
      transformedLines.push(`## ${textContent}`);
    }
  });

  return transformedLines.join('\n'); // Join transformed lines with newlines
};

const Publish = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    const wordCount = value.trim().split(/\s+/).length;

    if (wordCount <= 100) {
      setDescription(value);
    } else {
      alert('Description cannot exceed 100 words.');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'BotStreet'); // Replace with your Cloudinary upload preset
    formData.append('cloud_name', 'dzfoiqap7'); // Replace with your Cloudinary cloud name

    setIsImageUploading(true);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dzfoiqap7/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        alert('Image uploaded successfully!');
      } else {
        alert('Error uploading image');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }

    setIsImageUploading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('published');

    if (!title || !content || !description) {
      alert('Title, content, and description are required.');
      return;
    }

    if (!imageUrl) {
      alert('Please upload an image before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const transformedContent = transformContent(content);

      const response = await fetch('http://localhost:3000/api/articles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: transformedContent,
          description,
          image: imageUrl,
          status: 'published',
        }),
      });

      if (response.ok) {
        alert('Article published successfully!');
        setTitle('');
        setContent('');
        setDescription('');
        setImageUrl('');
        navigate('/'); // Navigate to the home page
      } else {
        alert('Error publishing article');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-center mb-8">Publish Your Article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-lg font-medium">Article Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter article title"
            required
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-lg font-medium">Article Description</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Write a short description (max 100 words)"
            rows="4"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-lg font-medium">Article Content</label>
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            placeholder="Write your article here"
            className="border-2 border-gray-300 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="text-lg font-medium">Upload an Image</label>
          <input
            type="file"
            id="image"
            onChange={handleImageUpload}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none"
          />
          {isImageUploading && <p className="text-gray-500">Uploading image...</p>}
          {imageUrl && <p className="text-green-500">Image uploaded! <a href={imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 text-lg font-medium rounded-lg ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-all`}
        >
          {isSubmitting ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
};

export default Publish;
