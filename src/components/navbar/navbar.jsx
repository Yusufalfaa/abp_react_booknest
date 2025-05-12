import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import './navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [queryText, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const searchRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error('Error signing out:', error));
  };

const handleSearch = async (e) => {
  const val = e.target.value.toLowerCase();  // Hanya mengubah input ke lowercase, tanpa trim()
  setQuery(val);

  if (val === '') {
    setResults([]);
    return;
  }

  try {
    // Ambil semua data buku dari Firestore
    const querySnapshot = await getDocs(collection(db, 'books'));

    const matchedBooks = [];
    querySnapshot.forEach((doc) => {
      const book = doc.data();
      const bookTitle = book.title.toLowerCase();  // Convert judul buku ke lowercase

      // Cek apakah input ada di dalam judul (case-insensitive)
      if (bookTitle.includes(val)) {
        matchedBooks.push({ id: doc.id, ...book });
      }
    });

    setResults(matchedBooks);
  } catch (error) {
    console.error("Error searching books:", error);
  }
};



  const handleCloseOffcanvas = () => {
    const offcanvasEl = document.getElementById('bdNavbar');
    if (offcanvasEl && window.bootstrap) {
      const offcanvasInstance = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    }
  };

  return (
    <header id="header" className="site-header">
      <nav className="navbar navbar-expand-lg py-3">
        <div className="container">
          <NavLink className="navbar-brand" to="/" onClick={handleCloseOffcanvas}>
            <img src="assets/BookNest.png" alt="Logo" className="logo" />
          </NavLink>
          <button
            className="navbar-toggler d-flex d-lg-none order-3 p-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#bdNavbar"
            aria-controls="bdNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="bdNavbar"
            aria-labelledby="bdNavbarOffcanvasLabel"
          >
            <div className="offcanvas-header px-4 pb-0">
              <NavLink className="navbar-brand" to="/" onClick={handleCloseOffcanvas}>
                <img src="assets/BookNest.png" alt="Logo" className="logo" />
              </NavLink>
              <button
                type="button"
                className="btn-close btn-close-black"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body">
              <ul
                id="navbar"
                className="navbar-nav text-uppercase justify-content-start justify-content-lg-start align-items-start align-items-lg-center flex-grow-1"
              >
                <li className="nav-item">
                  <NavLink className="nav-link me-4" exact="true" to="/" activeclassname="active" onClick={handleCloseOffcanvas}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link me-4" to="/allbooks" activeclassname="active" onClick={handleCloseOffcanvas}>
                    All Books
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link me-4" to="/forum" activeclassname="active" onClick={handleCloseOffcanvas}>
                    Forum
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link me-4" to="/mybooks" activeclassname="active" onClick={handleCloseOffcanvas}>
                    MyBooks
                  </NavLink>
                </li>

                {/* Search + Auth Section */}
                <div className="d-flex align-items-center ms-lg-auto" style={{ marginLeft: '150px' }} ref={searchRef}>
                  {/* 🔍 Search Icon */}
                  {!isSearchOpen ? (
                    <button className="btn btn-link text-dark me-3" onClick={() => setIsSearchOpen(true)}>
                      <i className="fas fa-search"></i>
                    </button>
                  ) : (
                    <div className="position-relative me-3">
                      <input
                        type="text"
                        className="form-control"
                        value={queryText}
                        onChange={handleSearch}
                        placeholder="Search books..."
                        autoFocus
                        style={{ width: '220px' }}
                      />
                      {results.length > 0 && (
                        <ul className="search-results bg-white shadow-sm border mt-2 rounded p-2 position-absolute" style={{ zIndex: 999 }}>
                          {results.map((book) => (
                            <li key={book.id}>
                              <NavLink
                                to={`/bookdetail/${book.id}`}
                                className="text-dark text-decoration-none"
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  setResults([]);
                                  setQuery('');
                                  handleCloseOffcanvas();
                                }}
                              >
                                {book.title}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Auth Buttons */}
                  {user ? (
                    <button className="btn logout-btn" onClick={handleLogout}>
                      LOG OUT
                    </button>
                  ) : (
                    <>
                      <NavLink to="/login" className="signin-btn pt-3 pb-3 pe-4 ps-4 me-2" onClick={handleCloseOffcanvas}>
                        Sign In
                      </NavLink>
                      <NavLink to="/regist" className="signup-btn pt-3 pb-3 pe-4 ps-4" onClick={handleCloseOffcanvas}>
                        Sign Up
                      </NavLink>
                    </>
                  )}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
