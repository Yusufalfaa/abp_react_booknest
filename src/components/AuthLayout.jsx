import React from 'react';
import './CustomAlert.css';  // CSS untuk styling alert

function CustomAlert({ message, onClose }) {
  return (
    <div className="custom-alert">
      <div className="custom-alert-content">
        <div className="custom-alert-icon">
          <i className="bi bi-info-circle"></i> {/* Ikon informasi */}
        </div>
        <div className="custom-alert-message">
          <p>{message}</p>
        </div>
        <button className="custom-alert-close" onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export default CustomAlert;
