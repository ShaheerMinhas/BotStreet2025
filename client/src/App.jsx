// eslint-disable-next-line no-unused-vars
import React from 'react';
import './App.css';
import Home from './pages/Home';
// In your main entry file (e.g., index.js or App.js)
import 'flowbite/dist/flowbite.min.css';
import 'flowbite';
import SignUp from './pages/Authentication/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticlePage from './pages/Article';
import SignIn from './pages/Authentication/SignIn';
import Admin from './pages/Admin';
import ArticlesHome from './pages/ArticleHome';
import Publish from './pages/Publish';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/articles" element={<ArticlesHome/>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/blog/:id" element={<ArticlePage />} />
        <Route path='/admin1' element ={<Admin />} />
        <Route path='/publish' element={<Publish />} />
        
      </Routes>
    </Router>
  );
}

export default App;

