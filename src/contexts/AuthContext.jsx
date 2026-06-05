import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { userExists, createUserDoc, updateUserDoc } from '../firebase/userService';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign in with Email and Password (Admin only)
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  // Returns { user, isNewUser } — isNewUser=true means no Firestore profile yet
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const exists = await userExists(user.uid);
      return { user, isNewUser: !exists };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Setup reCAPTCHA for phone authentication
  const setupRecaptcha = (elementId) => {
    try {
      // Always clear existing verifier to avoid stale state
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      
      // Use normal (visible) reCAPTCHA for better reliability
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'normal', // Changed from 'invisible' for better reliability
        callback: (response) => {
          console.log('[Auth] reCAPTCHA solved successfully');
        },
        'expired-callback': () => {
          console.warn('[Auth] reCAPTCHA expired, please retry');
          window.recaptchaVerifier = null;
        },
        'error-callback': (error) => {
          console.error('[Auth] reCAPTCHA error:', error);
          window.recaptchaVerifier = null;
        }
      });
      
      // Render the reCAPTCHA
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
        console.log('[Auth] reCAPTCHA rendered successfully');
      }).catch((error) => {
        console.error('[Auth] reCAPTCHA render failed:', error);
        throw new Error('Failed to load reCAPTCHA. Please refresh the page.');
      });
      
      return window.recaptchaVerifier;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Send OTP to phone number with timeout (elementId is the DOM element id for reCAPTCHA)
  const sendPhoneOTP = async (phoneNumber, elementId, timeout = 30000) => {
    try {
      setError(null);
      const verifier = setupRecaptcha(elementId);
      
      // Add timeout to prevent indefinite waiting
      const otpPromise = signInWithPhoneNumber(auth, phoneNumber, verifier);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout. Please check your internet connection and try again.')), timeout)
      );
      
      const confirmationResult = await Promise.race([otpPromise, timeoutPromise]);
      console.log('[Auth] OTP sent successfully to', phoneNumber);
      return confirmationResult;
    } catch (error) {
      // Clear verifier on error so it can be recreated on retry
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      
      // Provide better error messages
      console.error('[Auth] Send OTP failed:', error.code, error.message);
      if (error.code === 'auth/quota-exceeded') {
        error.message = 'SMS quota exceeded. Please try again later or contact support.';
      } else if (error.code === 'auth/invalid-phone-number') {
        error.message = 'Invalid phone number. Please check the format (+91XXXXXXXXXX).';
      } else if (error.message.includes('timeout')) {
        error.message = 'Request timeout. Please check your internet connection and try again.';
      }
      
      setError(error.message);
      throw error;
    }
  };

  // Verify OTP entered by user
  // Returns { user, isNewUser } — isNewUser=true means no Firestore profile yet
  const verifyPhoneOTP = async (confirmationResult, otp) => {
    try {
      setError(null);
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const exists = await userExists(user.uid);
      return { user, isNewUser: !exists };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Save / update user profile in Firestore
  const saveUserProfile = async (uid, data) => {
    try {
      const exists = await userExists(uid);
      if (exists) {
        await updateUserDoc(uid, data);
      } else {
        await createUserDoc(uid, data);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signInWithEmail,
    signInWithGoogle,
    setupRecaptcha,
    sendPhoneOTP,
    verifyPhoneOTP,
    logout,
    saveUserProfile,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
