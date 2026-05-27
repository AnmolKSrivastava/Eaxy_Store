import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { logo } from '../../assets/images';
import PhoneAuthModal from './PhoneAuthModal';
import UserRegistrationModal from './UserRegistrationModal';
import './UserLoginModal.css';

function UserLoginModal({ isOpen, onClose }) {
  const { signInWithGoogle } = useAuth();
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [pendingAuthUser, setPendingAuthUser] = useState(null); // Firebase user awaiting profile creation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen && !showPhoneAuth && !showRegistration) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const { user, isNewUser } = await signInWithGoogle();
      if (isNewUser) {
        setPendingAuthUser(user);
        setShowRegistration(true);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please enable pop-ups for this site.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuthClick = () => {
    setShowPhoneAuth(true);
  };

  const handlePhoneAuthClose = () => {
    setShowPhoneAuth(false);
  };

  // Called by PhoneAuthModal when OTP verified but user has no Firestore profile
  const handlePhoneNewUser = (user) => {
    setShowPhoneAuth(false);
    setPendingAuthUser(user);
    setShowRegistration(true);
  };

  const handlePhoneAuthSuccess = () => {
    setShowPhoneAuth(false);
    onClose();
  };

  const handleRegisterClick = () => {
    setPendingAuthUser(null);
    setShowRegistration(true);
  };

  const handleRegistrationClose = () => {
    setShowRegistration(false);
    setPendingAuthUser(null);
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setPendingAuthUser(null);
    onClose();
  };

  const handleSwitchToLogin = () => {
    setShowRegistration(false);
    setPendingAuthUser(null);
  };

  // If registration modal is open, show it instead
  if (showRegistration) {
    return (
      <UserRegistrationModal
        isOpen={showRegistration}
        onClose={handleRegistrationClose}
        onSuccess={handleRegistrationSuccess}
        onSwitchToLogin={handleSwitchToLogin}
        authUser={pendingAuthUser}
      />
    );
  }

  // If phone auth modal is open, show it instead
  if (showPhoneAuth) {
    return (
      <PhoneAuthModal
        isOpen={showPhoneAuth}
        onClose={handlePhoneAuthClose}
        onSuccess={handlePhoneAuthSuccess}
        onNewUser={handlePhoneNewUser}
      />
    );
  }

  return (
    <div className="user-login-overlay" onClick={onClose}>
      <div className="user-login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="brand-logo-container">
            <img src={logo} alt="Eaxy Store" className="brand-logo" />
          </div>
          <h2>Welcome to Eaxy Store</h2>
          <p className="subtitle">Sign in to access your account</p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="login-methods">
          <button
            className="login-method-btn google-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="google-icon">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            className="login-method-btn phone-btn"
            onClick={handlePhoneAuthClick}
            disabled={loading}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="phone-icon"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Continue with Phone
          </button>
        </div>

        <div className="modal-footer">
          <p className="admin-link">
            New user?{' '}
            <button onClick={handleRegisterClick} className="register-link-btn">
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLoginModal;
