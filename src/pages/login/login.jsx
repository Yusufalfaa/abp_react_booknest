import React, { useState, useEffect } from 'react';
import './login.css';

const Login = () => {
  const [successAlert, setSuccessAlert] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('successSignup')) {
      setSuccessAlert(true);
      setTimeout(() => {
        setSuccessAlert(false);
      }, 5000); // Hide alert after 5 seconds
    }
  }, []);

  const handleSignIn = (event) => {
    event.preventDefault();
    const username = event.target.username.value.trim();
    const password = event.target.password.value.trim();

    setUsernameError('');
    setPasswordError('');

    let isValid = true;

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (isValid) {
      setIsSubmitting(true);
      // Add login logic here
    }
  };

  return (
    <div className="login-body">
      {successAlert && <div className="success-alert">Registration successful! Please sign in to start.</div>}

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
            <a className="login-signup-btn py-2 w-75" href="/signup">Sign Up</a>
          </div>

          {/* Right Section (Form) */}
          <div className="form-section">
            <button type="button" className="btn-close" onClick={() => window.location.href = '/'}></button>
            <h2 className="text-center fw-bold mb-4 mt-1">Sign In</h2>

            <form onSubmit={handleSignIn}>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="username" name="username" placeholder="Username" required />
                <label htmlFor="username">Username</label>
                {usernameError && <div className="text-danger">{usernameError}</div>}
              </div>

              <div className="form-floating">
                <input type="password" className="form-control" id="password" name="password" placeholder="Password" required />
                <label htmlFor="password">Password</label>
                {passwordError && <div className="text-danger">{passwordError}</div>}
              </div>

              <div className="alert alert-danger mt-3" style={{ display: passwordError || usernameError ? 'block' : 'none' }}>
                Invalid username or password
              </div>

              <button type="submit" className="btn w-100 main-btn mt-5" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
