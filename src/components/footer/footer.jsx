import './footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3>BookNest</h3>
          <ul>

            <a href="https://instagram.com/uptd_puskesmaskujangsari" target="_blank" rel="noopener noreferrer">
              <li><i className="fab fa-instagram"></i> @</li>
            </a>
            <li><i className="fas fa-envelope"></i> booknest@gmail.com</li>
          </ul>
        </div>

        <div className="footer-right">
          <p>&copy; 2025 BookNest</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;