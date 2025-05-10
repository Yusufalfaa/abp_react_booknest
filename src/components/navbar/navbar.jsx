import './navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header id="header" className="site-header">
      <nav className="navbar navbar-expand-lg py-3">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img
              src="assets/BookNest.png"
              alt="Logo"
              className="logo"
            />
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
            <svg className="navbar-icon">
              <use xlinkHref="#navbar-icon"></use>
            </svg>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="bdNavbar"
            aria-labelledby="bdNavbarOffcanvasLabel"
          >
            <div className="offcanvas-header px-4 pb-0">
              <NavLink className="navbar-brand" to="/">
                <img
                  src="assets/BookNestFix.png"
                  alt="Logo"
                  className="logo"
                />
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
                className="navbar-nav text-uppercase justify-content-start justify-content-lg-center align-items-start align-items-lg-center flex-grow-1"
              >
                <li className="nav-item">
                  <NavLink
                    className="nav-link me-4"
                    exact
                    to="/"
                    activeClassName="active"
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link me-4"
                    to="/allbooks"
                    activeClassName="active"
                  >
                    All Books
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link me-4"
                    to="/forum"
                    activeClassName="active"
                  >
                    Forum
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link me-4"
                    to="/mybooks"
                    activeClassName="active"
                  >
                    MyBooks
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="signin-btn pt-3 pb-3 pe-4 ps-4">
                    Sign In
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/regist" className="signup-btn pt-3 pb-3 pe-4 ps-4">
                    Sign Up
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
