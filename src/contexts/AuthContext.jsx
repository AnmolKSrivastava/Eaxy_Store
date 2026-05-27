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
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          window.recaptchaVerifier = null;
        }
      });
      return window.recaptchaVerifier;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Send OTP to phone number (elementId is the DOM element id for reCAPTCHA)
  const sendPhoneOTP = async (phoneNumber, elementId) => {
    try {
      setError(null);
      const verifier = setupRecaptcha(elementId);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      return confirmationResult;
    } catch (error) {
      // Clear verifier on error so it can be recreated on retry
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
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
