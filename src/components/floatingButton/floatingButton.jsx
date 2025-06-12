import React from 'react';
import './floatingButton.css';
import { Link } from 'react-router-dom';

const FloatingFAQButton = () => {
  return (
    <Link to="/faq" className="floating-button" aria-label="FAQ">
    </Link>
  );
};

export default FloatingFAQButton;
