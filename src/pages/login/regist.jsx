import './regist.css';

const Register = () => {
  return (
    <div className="register-body">
      <div className="register-container">
        <div className="content-wrapper">
          {/* Left Section - Form */}
          <div className="form-section-regist">
            {/* Logo moved to the form section */}
            <img src="/assets/BookNest.png" className="logo" alt="Logo" />
            <h2 className="text-center fw-bold mb-4 mt-3">Sign Up</h2>

            <form method="post">
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
                <input type="password" className="form-control" id="passwordConfirmation" name="passwordConfirmation" placeholder="Confirm Password" required />
                <label htmlFor="passwordConfirmation">Password Confirmation</label>
              </div>

              <button type="submit" className="btn w-100 main-btn">Sign Up</button>
            </form>
          </div>

          {/* Right Section - Image */}
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
