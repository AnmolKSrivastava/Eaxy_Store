import React, { useState } from 'react';
import { X, Smartphone, Lock, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './PhoneAuthModal.css';

function PhoneAuthModal({ onClose, onSuccess, onNewUser }) {
  const { sendPhoneOTP, verifyPhoneOTP } = useAuth();
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP, 3: Success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const formatPhoneNumber = (number) => {
    // Remove all non-digits
    let cleaned = number.replace(/\D/g, '');
    
    // Add +91 prefix if not present
    if (!cleaned.startsWith('91')) {
      cleaned = '91' + cleaned;
    }
    
    return '+' + cleaned;
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formattedNumber = formatPhoneNumber(phoneNumber);
      const result = await sendPhoneOTP(formattedNumber, 'recaptcha-container');
      setConfirmationResult(result);
      setOtpSent(true);
      setStep(2);
    } catch (error) {
      console.error('Send OTP Error:', error);
      if (error.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(error.message || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Verifying OTP...');
      const { user, isNewUser } = await verifyPhoneOTP(confirmationResult, otp);
      console.log('Phone auth success:', user?.phoneNumber || user?.uid);
      setStep(3);
      setTimeout(() => {
        if (isNewUser && onNewUser) {
          onNewUser(user);
        } else {
          onSuccess(user);
        }
      }, 1500);
    } catch (error) {
      console.error('Verify OTP Error:', error);
      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again.');
      } else if (error.code === 'auth/code-expired') {
        setError('OTP expired. Please request a new one.');
      } else {
        setError(error.message || 'Failed to verify OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setError(null);
    await handleSendOTP();
  };

  const handleBack = () => {
    setStep(1);
    setOtp('');
    setError(null);
    setOtpSent(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="phone-auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {step === 1 ? (
              <>
                <Smartphone size={24} />
                <span>Phone Authentication</span>
              </>
            ) : (
              <>
                <Lock size={24} />
                <span>Verify OTP</span>
              </>
            )}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-alert">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {step === 3 ? (
            <div className="success-step">
              <div className="success-icon-circle">
                <Check size={36} />
              </div>
              <h3>Verified Successfully!</h3>
              <p>You're now signed in.</p>
            </div>
          ) : step === 1 ? (
            <div className="phone-step">
              <p className="step-description">
                Enter your phone number to receive a verification code
              </p>
              <div className="phone-input-group">
                <div className="country-code">
                  <span className="flag">🇮🇳</span>
                  <span className="code">+91</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setPhoneNumber(value);
                      setError(null);
                    }
                  }}
                  placeholder="9876543210"
                  maxLength="10"
                  className="phone-input"
                  disabled={loading}
                />
              </div>
              <div id="recaptcha-container"></div>
              <button
                className="primary-btn"
                onClick={handleSendOTP}
                disabled={loading || phoneNumber.length !== 10}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="otp-step">
              {otpSent && (
                <div className="success-badge">
                  <Check size={16} />
                  <span>OTP sent to +91 {phoneNumber}</span>
                </div>
              )}
              <p className="step-description">
                Enter the 6-digit code we sent to your phone
              </p>
              <div className="otp-input-group">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setOtp(value);
                      setError(null);
                    }
                  }}
                  placeholder="000000"
                  maxLength="6"
                  className="otp-input"
                  disabled={loading}
                />
              </div>
              <div className="otp-actions">
                <button
                  className="primary-btn"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Sign In</span>
                      <Check size={18} />
                    </>
                  )}
                </button>
                <div className="secondary-actions">
                  <button
                    className="text-btn"
                    onClick={handleResendOTP}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                  <button
                    className="text-btn"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Change Number
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhoneAuthModal;
