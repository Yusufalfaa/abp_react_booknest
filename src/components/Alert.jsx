
function AlertComponent({ message, type = 'warning', onClose }) {
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      <strong>{type === 'warning' ? 'Warning!' : type === 'success' ? 'Success!' : 'Info!'}</strong> {message}
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    </div>
  );
}

export default AlertComponent;
