import React from 'react';
import './App.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';

import { Routes, Route } from 'react-router-dom';

import Home from './pages/home/home';
import AllBooks from './pages/allbooks/allbooks';
import Forum from './pages/forum/forum';
import MyBooks from './pages/mybooks/mybooks';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/allbooks" element={<AllBooks />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/mybooks" element={<MyBooks />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;