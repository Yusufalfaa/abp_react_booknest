import React, { useState, useEffect } from 'react';
import './login.css';
import { 
  auth, 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserSessionPersistence, 
  GoogleAuthProvider, 
  signInWithPopup,
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../components/Alerts/alert';

const Login = () => {
  const [successAlert, setSuccessAlert] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('successSignup')) {
      setSuccessAlert(true);
      setTimeout(() => {
        setSuccessAlert(false);
      }, 5000);
    }
  }, []);

  const handleSignIn = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
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
        await setPersistence(auth, browserSessionPersistence);

        await signInWithEmailAndPassword(auth, email, password);
        setIsSubmitting(false);

        setIsSuccessAlertVisible(true);

        setTimeout(() => {
          setIsSuccessAlertVisible(false);
          navigate('/');
        }, 3000);
      } catch (error) {
        setIsSubmitting(false);
        setEmailError('Invalid email or password');
        setPasswordError('');
      }
    }
  };

  const handleGoogleSignIn = async () => {
  setIsSubmitting(true);
  const provider = new GoogleAuthProvider();
  try {
    await setPersistence(auth, browserSessionPersistence);

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Cek apakah user sudah ada di Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Jika belum ada, simpan data user baru
      const userData = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || 'No Name',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, userData);
    }

    setIsSubmitting(false);
    setIsSuccessAlertVisible(true);

    setTimeout(() => {
      setIsSuccessAlertVisible(false);
      navigate('/');
    }, 3000);
  } catch (error) {
    setIsSubmitting(false);
    setEmailError('Failed to login with Google');
  }
};


  return (
    <div className="login-body">
      {isSuccessAlertVisible && (
        <Alert
          title="Success"
          message="Login successful! Welcome back."
          type="success"
          onClose={() => setIsSuccessAlertVisible(false)}
          duration={3000}
        />
      )}

      {successAlert && (
        <div className="success-alert">
          Registration successful! Please sign in to start.
        </div>
      )}

      <div className="login-container">
        <div className="content-wrapper">
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
            <div className="overlay"></div>
            <img src="/assets/BookNest.png" className="logo" alt="Logo" style={{ position: 'absolute', top: '10px', left: '10px', width: '150px' }} />
            <h2 className="fw-bold">Welcome Back!</h2>
            <p className="mt-2 text-center">Sign in and start your journey</p>
            <p className="mt-5 text-center">Don’t have an account yet?</p>
            <a className="login-signup-btn py-2 w-75" href="/regist">Sign Up</a>
          </div>

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

            <button 
              type="button" 
              className="btn w-100 google-btn mt-3" 
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
            >
              <img src="/assets/google-icon.png" alt="Google" className="google-icon" />
              {isSubmitting ? 'Signing In...' : 'Login with Google'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
