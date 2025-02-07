import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Publish = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorLinkedIn, setAuthorLinkedIn] = useState('');
  const [titleImageUrl, setTitleImageUrl] = useState('');
  const [articleImages, setArticleImages] = useState([]); // Stores image URLs in the article
  const quillRef = useRef(null);

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleContentChange = (value) => {
    setContent(value);
    extractImagesFromContent(value);
  };
  const handleAuthorNameChange = (event) => setAuthorName(event.target.value);
  const handleAuthorLinkedInChange = (event) => setAuthorLinkedIn(event.target.value);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://botstreet2025.onrender.com";
  
  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount <= 100) {
      setDescription(value);
    } else {
      alert('Description cannot exceed 100 words.');
    }
  };

  // Upload function for title image
  const handleTitleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await uploadImage(file, 'title');
  };

  // Function to upload images
  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'BotStreet');
    formData.append('cloud_name', 'dzfoiqap7');

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dzfoiqap7/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        if (type === 'title') {
          setTitleImageUrl(data.secure_url);
          alert('Title Image uploaded successfully!');
        } else {
          insertImageIntoEditor(data.secure_url);
          setArticleImages((prevImages) => [...prevImages, data.secure_url]); // Store article images
          alert('Article Image uploaded successfully!');
        }
      } else {
        alert('Error uploading image');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Insert image inside the Quill editor
  const insertImageIntoEditor = (imageUrl) => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', imageUrl);
  };

  // Extract image URLs from article content
  const extractImagesFromContent = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = Array.from(doc.querySelectorAll('img')).map(img => img.src);
    setArticleImages(images);
  };

  // Custom Image Handler for Quill toolbar
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) await uploadImage(file, 'article');
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        ['link', 'image'], // Image button integrated
        ['clean'],
      ],
      handlers: {
        image: imageHandler, // Custom image handler
      },
    },
  }), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // 🔍 DEBUGGING CONSOLE LOGS:
    console.log('📝 Article Title:', title);
    console.log('👤 Author Name:', authorName);
    console.log('🔗 LinkedIn URL:', authorLinkedIn);
    console.log('📜 Description:', description);
    console.log('📄 Article Content:', content);
    console.log('🖼️ Title Image URL:', titleImageUrl);
    console.log('📷 Images inside Article:', articleImages);

    // 🚨 SUBMISSION DISABLED 🚨
    // Commented out for debugging, remove comments to enable API submission
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          description,
          author_name: authorName,
          author_linkedin: authorLinkedIn,
          image: titleImageUrl,
          article_images: articleImages,
          status: 'published',
        }),
      });

      if (response.ok) {
        alert('Article published successfully!');
        setTitle('');
        setContent('');
        setDescription('');
        setAuthorName('');
        setAuthorLinkedIn('');
        setTitleImageUrl('');
        setArticleImages([]);
      } else {
        alert('Error publishing article');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-center mb-8">Publish Your Article UNDER CONSTRUCTION</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-lg font-medium">Article Title</label>
          <input type="text" value={title} onChange={handleTitleChange} required className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-medium">Author Name</label>
          <input type="text" value={authorName} onChange={handleAuthorNameChange} required className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-medium">LinkedIn Profile</label>
          <input type="url" value={authorLinkedIn} onChange={handleAuthorLinkedInChange} required className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-medium">Description (max 100 words)</label>
          <textarea value={description} onChange={handleDescriptionChange} rows="4" className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-medium">Title Image</label>
          <input type="file" onChange={handleTitleImageUpload} className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none" />
          {titleImageUrl && <img src={titleImageUrl} alt="Title" className="w-full max-h-64 object-cover rounded-lg mt-2" />}
        </div>

        <div className="space-y-2">
          <label className="text-lg font-medium">Article Content</label>
          <ReactQuill ref={quillRef} value={content} onChange={handleContentChange} modules={modules} className="border-2 border-gray-300 rounded-lg" />
        </div>

        <button type="submit" className="w-full py-3 text-lg font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all">
          Publish
        </button>
      </form>
    </div>
  );
};

export default Publish;

