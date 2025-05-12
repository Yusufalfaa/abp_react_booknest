import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { AuthAlert } from '../Alerts/authalert'; // Mengimpor AuthAlert
import { Alert } from '../Alerts/alert'; // Mengimpor Alert biasa
import './navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [queryText, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const searchRef = useRef();
  const dropdownRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthAlertVisible, setIsAuthAlertVisible] = useState(false); // State untuk AuthAlert
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false); // State untuk Success Alert

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Bagian handleLogout
  const handleLogout = () => {
    setIsAuthAlertVisible(true); // Menampilkan alert ketika tombol logout diklik
  };

  const handleSearch = async (e) => {
    const val = e.target.value.toLowerCase();
    setQuery(val);

    if (val === '') {
      setResults([]);
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'books'));
      const matchedBooks = [];
      querySnapshot.forEach((doc) => {
        const book = doc.data();
        const bookTitle = book.title.toLowerCase();

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

  // Menangani konfirmasi logout
const handleLogoutConfirm = () => {
  signOut(auth).then(() => {
    console.log("User signed out successfully");
    setIsAuthAlertVisible(false); // Menutup alert setelah logout
    setIsSuccessAlertVisible(true); // Menampilkan success alert setelah log out berhasil

    // Navigasi ke halaman login setelah logout
    setTimeout(() => {
      // Menggunakan `history.push` atau `navigate` untuk navigasi programatik
      window.location.href = "/login"; // Atau bisa menggunakan useNavigate() dari react-router-dom v6
    }, 2000); // Delay sebelum navigasi (misalnya 2 detik)
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
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
              <ul className="navbar-nav text-uppercase justify-content-start justify-content-lg-start align-items-start flex-grow-1">
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
                <div className="d-flex align-items-center ms-auto" ref={searchRef}>
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

                  {/* Dropdown for Auth */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="text-gray-800 hover:text-gray-600"
                      onClick={() => setIsDropdownOpen(prevState => !prevState)}
                      aria-expanded={isDropdownOpen ? 'true' : 'false'}
                    >
                      <i className="fas fa-user-circle fa-lg"></i> 
                    </button>

                    {isDropdownOpen && (
                      <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48">
                        {user ? (
                          <>
                            {/* Button Profile */}
                            <li>
                              <NavLink
                                to="/profile" // Sesuaikan dengan rute halaman profil Anda
                                className="dropdown-btn-profile block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                                onClick={handleCloseOffcanvas}
                              >
                                Profile
                              </NavLink>
                            </li>

                            {/* Button Log Out */}
                            <li>
                              <NavLink
                                to="/login" // Ganti ke halaman login atau halaman logout yang sesuai
                                className="dropdown-btn-logout block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                                onClick={(e) => {
                                  e.preventDefault(); // Mencegah navigasi langsung
                                  handleLogout(); // Tampilkan alert logout
                                }}
                              >
                                Log Out
                              </NavLink>
                            </li>
                            </>
                        ) : (
                          <>
                            <li>
                              <NavLink
                                to="/login"
                                className="dropdown-btn-signin block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                onClick={handleCloseOffcanvas}
                              >
                                Sign In
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/regist"
                                className="dropdown-btn-signup block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                onClick={handleCloseOffcanvas}
                              >
                                Sign Up
                              </NavLink>
                            </li>
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Render the AuthAlert component when visible */}
      {isAuthAlertVisible && (
        <AuthAlert
          isVisible={isAuthAlertVisible}
          onClose={() => setIsAuthAlertVisible(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}

      {/* Render the Success Alert after logout */}
      {isSuccessAlertVisible && (
        <Alert
          title="Success"
          message="You have successfully logged out."
          type="success"
          onClose={() => setIsSuccessAlertVisible(false)} 
          duration={3000} 
        />
      )}
    </header>
  );
};

export default Navbar;
