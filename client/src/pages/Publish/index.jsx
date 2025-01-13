import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import Quill styles

const Publish = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Handle title change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // Handle content change
  const handleContentChange = (value) => {
    setContent(value);
  };

  // Handle image upload to Postimages
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsImageUploading(true);

    try {
      const response = await fetch('https://api.postimages.org/2/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY' // Replace with your API Key
        }
      });

      const data = await response.json();
      if (data.success) {
        setImageUrl(data.url); // Set the image URL
        alert('Image uploaded successfully!');
      } else {
        alert('Error uploading image');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }

    setIsImageUploading(false);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !content) {
      alert('Title and content are required');
      return;
    }

    setIsSubmitting(true);

    // Here, you would typically send the data to a backend
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrl }),
      });

      if (response.ok) {
        alert('Article published successfully!');
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
