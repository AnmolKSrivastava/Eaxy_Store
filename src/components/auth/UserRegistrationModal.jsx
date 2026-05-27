import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { logo } from '../../assets/images';
import PhoneAuthModal from './PhoneAuthModal';
import './UserRegistrationModal.css';

/**
 * UserRegistrationModal supports two modes:
 *
 * 1. **Post-auth profile completion** (authUser prop provided):
 *    - The user is already authenticated in Firebase Auth.
 *    - We just collect their profile details and save to Firestore.
 *    - Auth buttons (Google/Phone) are hidden.
 *
 * 2. **Fresh sign-up** (no authUser):
 *    - User fills in profile details, then authenticates via Google or Phone.
 *    - After auth, saves profile to Firestore.
 */
function UserRegistrationModal({ isOpen, onClose, onSuccess, onSwitchToLogin, authUser }) {
  const { signInWithGoogle, saveUserProfile } = useAuth();
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Pre-fill form when authUser is provided (e.g. came via Google login)
  useEffect(() => {
    if (authUser) {
      setFormData(prev => ({
        ...prev,
        name: authUser.displayName || '',
        email: authUser.email || '',
        phone: authUser.phoneNumber || '',
      }));
    }
  }, [authUser]);

  if (!isOpen && !showPhoneAuth) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { setError('Please enter your name'); return false; }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address'); return false;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number'); return false;
    }
    if (!formData.address.trim()) { setError('Please enter your address'); return false; }
    return true;
  };

  // Mode 1: Already authenticated â€” just save profile to Firestore
  const handleCompleteProfile = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      setError('');
      await saveUserProfile(authUser.uid, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        photoURL: authUser.photoURL || '',
        provider: authUser.providerData?.[0]?.providerId || 'unknown',
      });
      if (onSuccess) onSuccess();
      else onClose();
    } catch (err) {
      console.error('Profile save error:', err);
      setError('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mode 2: Fresh sign-up â€” authenticate with Google then save
  const handleGoogleSignUp = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      setError('');
      const { user } = await signInWithGoogle();
      await saveUserProfile(user.uid, {
        name: formData.name || user.displayName || '',
        email: formData.email || user.email || '',
        phone: formData.phone,
        address: formData.address,
        photoURL: user.photoURL || '',
        provider: 'google.com',
      });
      if (onSuccess) onSuccess();
      else onClose();
    } catch (err) {
      console.error('Google sign-up error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please enable pop-ups for this site.');
      } else {
        setError('Failed to sign up with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Mode 2: Fresh sign-up â€” authenticate with Phone
  const handlePhoneSignUp = () => {
    if (!validateForm()) return;
    setShowPhoneAuth(true);
  };

  const handlePhoneAuthSuccess = async (user) => {
    try {
      setLoading(true);
      await saveUserProfile(user.uid, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || user.phoneNumber || '',
        address: formData.address,
        photoURL: '',
        provider: 'phone',
      });
      setShowPhoneAuth(false);
      if (onSuccess) onSuccess();
      else onClose();
    } catch (err) {
      console.error('Profile save error after phone auth:', err);
      setError('Failed to save profile. Please try again.');
      setShowPhoneAuth(false);
    } finally {
      setLoading(false);
    }
  };

  const isPostAuth = !!authUser;

  if (showPhoneAuth) {
    return (
      <PhoneAuthModal
        isOpen={showPhoneAuth}
        onClose={() => setShowPhoneAuth(false)}
        onSuccess={handlePhoneAuthSuccess}
      />
    );
  }

  return (
    <div className="user-registration-overlay" onClick={onClose}>
      <div className="user-registration-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="brand-logo-container">
            <img src={logo} alt="Eaxy Store" className="brand-logo" />
          </div>
          <h2>{isPostAuth ? 'Complete Your Profile' : 'Create Your Account'}</h2>
          <p className="subtitle">
            {isPostAuth
              ? 'Just a few more details to finish setting up your account'
              : 'Join Eaxy Store today'}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <form className="registration-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name *</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="reg-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address *</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone">Phone Number *</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                disabled={loading || (isPostAuth && !!authUser?.phoneNumber)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-address">Address *</label>
            <div className="input-wrapper">
              <MapPin size={18} className="input-icon" />
              <textarea
                id="reg-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your full address"
                disabled={loading}
                rows="3"
                required
              />
            </div>
          </div>

          {isPostAuth ? (
            /* Post-auth: just a submit button */
            <button
              type="button"
              className="signup-method-btn complete-btn"
              onClick={handleCompleteProfile}
              disabled={loading}
            >
              <CheckCircle size={18} />
              {loading ? 'Saving...' : 'Complete Registration'}
            </button>
          ) : (
            /* Fresh sign-up: choose auth method */
            <div className="signup-methods">
              <button
                type="button"
                className="signup-method-btn google-btn"
                onClick={handleGoogleSignUp}
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" className="google-icon">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {loading ? 'Signing up...' : 'Sign Up with Google'}
              </button>

              <div className="divider"><span>OR</span></div>

              <button
                type="button"
                className="signup-method-btn phone-btn"
                onClick={handlePhoneSignUp}
                disabled={loading}
              >
                <Phone size={20} />
                Sign Up with Phone
              </button>
            </div>
          )}
        </form>

        {!isPostAuth && (
          <div className="modal-footer">
            <p className="login-link">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="link-btn">
                Login here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserRegistrationModal;
