import React, { useState, useEffect } from 'react';
import './login.css';
import { auth, signInWithEmailAndPassword } from '../../firebase/firebase';  // Adjust path as needed
import { useNavigate } from 'react-router-dom';  // Replaced useHistory with useNavigate
import { Alert } from '../../components/Alerts/alert';  // Import Alert component

const Login = () => {
  const [successAlert, setSuccessAlert] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false); // State for success alert
  const navigate = useNavigate(); // Use navigate instead of history

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('successSignup')) {
      setSuccessAlert(true);
      setTimeout(() => {
        setSuccessAlert(false);
      }, 5000); // Hide alert after 5 seconds
    }
  }, []);

  const handleSignIn = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();  // Changed to email
    const password = event.target.password.value.trim();

    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (isValid) {
      setIsSubmitting(true);
      try {
        // Firebase authentication logic for email and password
        await signInWithEmailAndPassword(auth, email, password);
        setIsSubmitting(false);
        // Show success alert after successful login
        setIsSuccessAlertVisible(true);
        // Wait for alert to disappear before navigating
        setTimeout(() => {
          setIsSuccessAlertVisible(false);  // Hide the alert
          navigate('/'); // Navigate to the home page or dashboard after alert is hidden
        }, 3000); // Set the same timeout as the alert duration
      } catch (error) {
        setIsSubmitting(false);
        // Handle error
        setEmailError('Invalid email or password');
        setPasswordError('');
      }
    }
  };

  return (
    <div className="login-body">
      {/* Render the Success Alert after login */}
      {isSuccessAlertVisible && (
        <Alert
          title="Success"
          message="Login successful! Welcome back."
          type="success"
          onClose={() => setIsSuccessAlertVisible(false)}
          duration={3000}
        />
      )}

      {/* Render the Success Alert for registration */}
      {successAlert && (
        <div className="success-alert">
          Registration successful! Please sign in to start.
        </div>
      )}

      <div className="login-container">
        <div className="content-wrapper">
          {/* Left Section (Image) */}
          <div 
            className="image-section" 
            style={{
              minWidth: '50%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              color: 'white',
              position: 'relative',
              backgroundImage: 'url(/assets/bgbook1.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="overlay"></div> {/* Optional overlay to darken background */}
            <img src="/assets/BookNest.png" className="logo" alt="Logo" style={{ position: 'absolute', top: '10px', left: '10px', width: '150px' }} />
            <h2 className="fw-bold">Welcome Back!</h2>
            <p className="mt-2 text-center">Sign in and start your journey</p>
            <p className="mt-5 text-center">Don’t have an account yet?</p>
            <a className="login-signup-btn py-2 w-75" href="/regist">Sign Up</a>
          </div>

          {/* Right Section (Form) */}
          <div className="form-section">
            <button type="button" className="btn-close" onClick={() => window.location.href = '/'}></button>
            <h2 className="text-center fw-bold mb-4 mt-1">Sign In</h2>

            <form onSubmit={handleSignIn}>
              <div className="form-floating mb-3">
                <input type="email" className="form-control" id="email" name="email" placeholder="Email" required />
                <label htmlFor="email">Email</label>
                {emailError && <div className="text-danger">{emailError}</div>}
              </div>

              <div className="form-floating">
                <input type="password" className="form-control" id="password" name="password" placeholder="Password" required />
                <label htmlFor="password">Password</label>
                {passwordError && <div className="text-danger">{passwordError}</div>}
              </div>

              <div className="alert alert-danger mt-3" style={{ display: passwordError || emailError ? 'block' : 'none' }}>
                Invalid email or password
              </div>

              <button type="submit" className="btn w-100 main-btn mt-5" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <div className="separator-container">
              <hr className="separator-line" />
              <span className="separator-text">OR</span>
              <hr className="separator-line" />
            </div>

            <button type="button" className="btn w-100 google-btn mt-3">
              <img src="/assets/google-icon.png" alt="Google" className="google-icon" />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
