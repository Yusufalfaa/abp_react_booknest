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
import Reply from './pages/reply/reply';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<><Navbar /><Home /><Footer /><FloatingFAQButton /></>} />
        <Route path="/allbooks" element={<><Navbar /><AllBooks /><Footer /><FloatingFAQButton /></>} />
        <Route path="/forum" element={<><Navbar /><Forum /><Footer /><FloatingFAQButton /></>} />
        <Route path="/mybooks" element={<><Navbar /><MyBooks /><Footer /><FloatingFAQButton /></>} />
        <Route path="/discuss" element={<><Navbar /><Reply /><Footer /><FloatingFAQButton /></>} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
