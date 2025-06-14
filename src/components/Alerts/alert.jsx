import './alert.css';

function Alert({ title, message, type = 'success', onClose, duration = 2000 }) {
  // Icon berdasarkan tipe
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✔';
      case 'warning':
        return '!';
      case 'error':
        return '✖'; 
      case 'info':
        return 'ℹ';
      default:
        return '?';
    }
  };

  // Auto close
  if (duration > 0) {
    setTimeout(() => {
      if (onClose) onClose();
    }, duration);
  }

  return (
    <div className={`alert-overlay ${type}`} onClick={onClose}>
      <div className="alert-box">
        <div className="alert-icon">{getIcon()}</div>
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{message}</div>
      </div>
    </div>
  );
}

export { Alert };
