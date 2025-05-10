import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer id="footer" className="padding-small mt-5 text-start footer" style={{ backgroundColor: '#F1EFE3' }}>
      <div className="container">
        <div className="row">
          <div className="footer-top-area">
            <div className="row d-flex flex-wrap justify-content-between">
              <div className="col-lg-3 col-sm-6 pb-3">
                <div className="footer-menu">
                  {/* <img src="images/main-logo.png" alt="logo" className="img-fluid mb-2"> */}
                  <img src="/assets/BookNest.png" className="logo" alt="Logo" />
                  <p>BookNest is a platform for book lovers to explore reviews, share ratings, and connect with a community of readers. Expand your literary journey with us!</p>
                </div>
              </div>
              <div className="col-lg-2 col-sm-6 pb-3">
                <div className="footer-menu text-capitalize">
                  <h5 className="widget-title pb-2">Quick Links</h5>
                  <ul className="menu-list list-unstyled text-capitalize">
                    <li className="menu-item mb-1">
                      <a href="/">Home</a>
                    </li>
                    <li className="menu-item mb-1">
                      <a href="/">About</a>
                    </li>
                    <li className="menu-item mb-1">
                      <a href="/">Shop</a>
                    </li>
                    <li className="menu-item mb-1">
                      <a href="/">Blogs</a>
                    </li>
                    <li className="menu-item mb-1">
                      <a href="/">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 pb-3">
                <div className="footer-menu contact-item">
                  <h5 className="widget-title text-capitalize pb-2">Contact Us</h5>
                  <p>Do you have any queries or suggestions? <a href="mailto:BookNest@gmail.com" className="text-decoration-underline">BookNest@gmail.com</a></p>
                  <p>If you need support? Just give us a call. <a href="tel:+5511122233344" className="text-decoration-underline">+55 111 222 333 44</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
