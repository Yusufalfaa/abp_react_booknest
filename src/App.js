import React from 'react';
import './App.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import FloatingFAQButton from './components/floatingButton/floatingButton';

import { Routes, Route } from 'react-router-dom';

import Home from './pages/home/home';
import AllBooks from './pages/allbooks/allbooks';
import Forum from './pages/forum/forum';
import MyBooks from './pages/mybooks/mybooks';
import Regist from './pages/login/regist';
import Login from './pages/login/login';
import Reply from './pages/forum/reply';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/allbooks" element={<AllBooks />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/mybooks" element={<MyBooks />} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/discuss" element={<Reply />} />
      </Routes>
      <FloatingFAQButton />
      <Footer />
    </div>
  );
}

export default App;