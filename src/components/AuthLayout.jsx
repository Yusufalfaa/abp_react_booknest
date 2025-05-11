// src/components/layouts/AuthLayout.js

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {children} {/* Content will be injected here */}
    </div>
  );
};

export default AuthLayout;
