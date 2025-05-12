import { useState } from 'react';
import { Alert } from '../Alerts/alert';
import './authalert.css'

function AuthAlert({ onClose, onConfirm }) {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const handleCancel = () => {
    onClose();
    setIsAlertVisible(false); 
  };

  const handleConfirm = () => {
    onConfirm(); 
    onClose(); 
    setIsAlertVisible(false);
  };

  return (
    <div>
      {isAlertVisible && (
        <Alert
          title="Are you sure?"
          message="Do you really want to log out?"
          type="warning"
          onClose={handleCancel}
          duration={0}
        >
          <div className="alert-actions">
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            <button className="btn btn-danger" onClick={handleConfirm}>Yes, Log Out</button>
          </div>
        </Alert>
      )}
    </div>
  );
}

export { AuthAlert };
