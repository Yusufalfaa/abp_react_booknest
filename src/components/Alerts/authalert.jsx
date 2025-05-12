import { useState } from 'react';
import './authalert.css'; // Pastikan ini sudah sesuai dengan styling yang diinginkan

function AuthAlert({ onClose, onConfirm }) {
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  const handleCancel = () => {
    onClose();
    setIsAlertVisible(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
    setIsAlertVisible(false);
  };

  // Custom Alert Component
  const renderAlert = () => {
    return (
      <div className="custom-alert-overlay" onClick={handleCancel}>
        <div className="custom-alert-box" onClick={(e) => e.stopPropagation()}>
          <div className="custom-alert-icon">!</div>
          <div className="custom-alert-title">Are you sure?</div>
          <div className="custom-alert-message">
            Do you really want to log out?
          </div>
          <div className="alert-actions">
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleConfirm}>
              Yes, Log Out
            </button>
          </div>
        </div>
      </div>
    );
  };

  return <div>{isAlertVisible && renderAlert()}</div>;
}

export { AuthAlert };
