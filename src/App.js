import React from "react";
import "./App.css";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import FloatingFAQButton from "./components/floatingButton/floatingButton";

import { Routes, Route, useLocation } from "react-router-dom";

<<<<<<< fatah
import Home from './pages/home/home';
import AllBooks from './pages/allbooks/allbooks';
import Forum from './pages/forum/forum';
import MyBooks from './pages/mybooks/mybooks';
import Regist from './pages/login/regist';
import Login from './pages/login/login';
import Reply from './pages/reply/reply';
import CreateForum from './pages/forum/createforum';
import BookDetail from './pages/bookdetail/bookdetail';
import Profile from './pages/profile/profile';
=======
import Home from "./pages/home/home";
import AllBooks from "./pages/allbooks/allbooks";
import Forum from "./pages/forum/forum";
import MyBooks from "./pages/mybooks/mybooks";
import Regist from "./pages/login/regist";
import Login from "./pages/login/login";
import Reply from "./pages/reply/reply";
import CreateForum from "./pages/forum/createforum";
import BookDetail from "./pages/bookdetail/bookdetail";
import Profile from "./pages/profile/profile";
import Genre from "./pages/genre/genre";
import FAQ from "./pages/faq/faq"; // Pastikan import FAQ
>>>>>>> local

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/regist";

  return (
    <div className="App">
      {isAuthPage ? (
        // Halaman Login dan Regist TIDAK ada layout
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/regist" element={<Regist />} />
        </Routes>
      ) : (
        // Halaman lainnya pakai layout dengan Navbar dan Footer
        <div className="page-wrapper">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/allbooks" element={<AllBooks />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/createforum" element={<CreateForum />} />
              <Route path="/mybooks" element={<MyBooks />} />
              <Route path="/discuss" element={<Reply />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookdetail/:id" element={<BookDetail />} />
<<<<<<< fatah
=======
              <Route path="/genre/:genre" element={<Genre />} />
              <Route path="/faq" element={<FAQ />} /> {/* Rute FAQ */}
>>>>>>> local
            </Routes>
          </div>
          <Footer />
          <FloatingFAQButton />
        </div>
      )}
    </div>
  );
}

export default App;