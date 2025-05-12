import React, { useState } from 'react';
import './regist.css';
import { useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, doc, setDoc } from '../../firebase/firebase'; // Sesuaikan path-nya
import { Alert } from '../../components/Alerts/alert'; // Import komponen Alert

const Register = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false); // State untuk alert sukses
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    const confirmPassword = event.target.passwordConfirmation.value.trim();

    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      // Buat user di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan ke Firestore (collection: users)
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
        uid: user.uid,
        createdAt: new Date().toISOString()
      });

      // Tampilkan alert sukses
      setIsSuccessAlertVisible(true);

      // Menunggu 3 detik untuk alert menghilang, lalu alihkan ke halaman login
      setTimeout(() => {
        setIsSuccessAlertVisible(false); // Menyembunyikan alert
        navigate('/login?successSignup=true'); // Arahkan ke halaman login setelah alert menghilang
      }, 3000); // Alert ditampilkan selama 3 detik
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-body">
      {/* Render the Success Alert after registration */}
      {isSuccessAlertVisible && (
        <Alert
          title="Success"
          message="Registration successful! Please sign in to start."
          type="success"
          onClose={() => setIsSuccessAlertVisible(false)}
          duration={3000}
        />
      )}

      <div className="register-container">
        <div className="content-wrapper">
          <div className="form-section-regist">
            <img src="/assets/BookNest.png" className="logo" alt="Logo" />
            <h2 className="text-center fw-bold mb-4 mt-3">Sign Up</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="username" name="username" placeholder="Username" required />
                <label htmlFor="username">Username</label>
              </div>

              <div className="form-floating mb-3">
                <input type="email" className="form-control" id="email" name="email" placeholder="Email" required />
                <label htmlFor="email">Email</label>
              </div>

              <div className="form-floating mb-3">
                <input type="password" className="form-control" id="password" name="password" placeholder="Password" required />
                <label htmlFor="password">Password</label>
              </div>

              <div className="form-floating mb-4">
                <input type="password" className="form-control" id="passwordConfirmation" name="passwordConfirmation" placeholder="Password Confirmation" required />
                <label htmlFor="passwordConfirmation">Password Confirmation</label>
              </div>

              <button type="submit" className="btn w-100 main-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Sign Up'}
              </button>
            </form>
          </div>

          <div className="image-section-regist" style={{ backgroundImage: 'url(/assets/bgbook1.png)' }}>
            <div className="overlay"></div>
            <button
              type="button"
              className="btn-close"
              style={{ filter: 'invert(1) grayscale(100%) brightness(200%)', opacity: 0.8 }}
              onClick={() => window.location.href = '/'}
            ></button>
            <h2 className="fw-bold">Welcome!</h2>
            <p className="mt-2 text-center">Please create an account to start</p>
            <p className="mt-5 text-center">Already have an account?</p>
            <a href="/login" className="login-signup-btn py-2 w-75">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
