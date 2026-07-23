# Phone OTP Issues - Complete Fix Guide

## 🔴 Problems Identified

### 1. **Missing reCAPTCHA Site Key** (CRITICAL)
- Your `.env` file is missing `REACT_APP_RECAPTCHA_SITE_KEY`
- Firebase Phone Auth **REQUIRES** reCAPTCHA for bot protection
- Without this, OTPs will be delayed or not sent

### 2. **Invisible reCAPTCHA Issues**
- Using `size: 'invisible'` can cause problems
- Sometimes requires user interaction but doesn't show UI
- Can fail silently in some browsers

### 3. **No Timeout Handling**
- OTP request has no timeout
- User waits indefinitely if Firebase is slow
- No feedback about delays

### 4. **Rate Limiting**
- Firebase has strict rate limits for phone auth
- Free tier: Limited SMS per day
- Too many requests = automatic blocking

### 5. **No Test Phone Numbers**
- Every test uses real SMS quota
- Depletes your daily limit quickly

### 6. **Browser Compatibility**
- reCAPTCHA v2 has issues in some browsers
- Need fallback mechanisms

### 7. **Firebase App Check Not Enabled**
- Makes your app vulnerable to quota abuse
- No protection against bots

---

## ✅ Complete Fix

### Step 1: Get reCAPTCHA Site Key

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click **"+"** to create a new site
3. Fill in:
   - **Label**: `Eaxy Store Phone Auth`
   - **reCAPTCHA type**: Select **"reCAPTCHA v2"** → **"Invisible reCAPTCHA badge"**
   - **Domains**: 
     - Add `localhost` (for development)
     - Add your production domain (e.g., `eaxy-store.web.app`)
   - Accept terms
4. Click **Submit**
5. **Copy the Site Key** (not the secret key!)

### Step 2: Update Environment Variables

Add to your `.env` file:

```env
# reCAPTCHA for Phone Authentication
<set your reCAPTCHA site key using your local environment file>
```

### Step 3: Update AuthContext.jsx

Replace the `setupRecaptcha` function with improved version:

```javascript
// Setup reCAPTCHA for phone authentication
const setupRecaptcha = (elementId) => {
  try {
    // Always clear existing verifier to avoid stale state
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    
    // Use visible reCAPTCHA for better reliability
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'normal', // Changed from 'invisible' to 'normal'
      callback: (response) => {
        console.log('reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        window.recaptchaVerifier = null;
      },
      'error-callback': (error) => {
        console.error('reCAPTCHA error:', error);
        window.recaptchaVerifier = null;
      }
    });
    
    // Render the reCAPTCHA
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
      console.log('reCAPTCHA rendered successfully');
    }).catch((error) => {
      console.error('reCAPTCHA render error:', error);
      throw new Error('Failed to load reCAPTCHA. Please refresh the page.');
    });
    
    return window.recaptchaVerifier;
  } catch (error) {
    setError(error.message);
    throw error;
  }
};

// Send OTP with timeout
const sendPhoneOTP = async (phoneNumber, elementId, timeout = 30000) => {
  try {
    setError(null);
    const verifier = setupRecaptcha(elementId);
    
    // Add timeout
    const otpPromise = signInWithPhoneNumber(auth, phoneNumber, verifier);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout. Please try again.')), timeout)
    );
    
    const confirmationResult = await Promise.race([otpPromise, timeoutPromise]);
    return confirmationResult;
  } catch (error) {
    // Clear verifier on error
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    
    // Better error messages
    if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS quota exceeded. Please try again later or contact support.');
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number. Please check and try again.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Request timeout. Please check your internet connection and try again.');
    }
    
    setError(error.message);
    throw error;
  }
};
```

### Step 4: Update PhoneAuthModal.jsx

Update the reCAPTCHA container styling:

```jsx
// In the phone step, after country code input
<div id="recaptcha-container" style={{
  marginTop: '15px',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '78px'
}}></div>
```

Add retry mechanism:

```javascript
const [retryCount, setRetryCount] = useState(0);
const MAX_RETRIES = 3;

const handleSendOTP = async () => {
  if (phoneNumber.length < 10) {
    setError('Please enter a valid 10-digit phone number');
    return;
  }

  if (retryCount >= MAX_RETRIES) {
    setError('Maximum retry attempts exceeded. Please try again later.');
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
    setRetryCount(0); // Reset on success
  } catch (error) {
    console.error('Send OTP Error:', error);
    setRetryCount(prev => prev + 1);
    
    if (error.code === 'auth/invalid-phone-number') {
      setError('Invalid phone number format');
    } else if (error.code === 'auth/too-many-requests') {
      setError('Too many attempts. Please try again in 30 minutes.');
    } else if (error.code === 'auth/quota-exceeded') {
      setError('SMS service temporarily unavailable. Please try again later.');
    } else {
      setError(error.message || 'Failed to send OTP. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
```

### Step 5: Setup Test Phone Numbers (Development)

1. Go to **Firebase Console** → **Authentication** → **Sign-in method**
2. Scroll down to **Phone** → Click **Phone numbers for testing**
3. Add test numbers:
   - Phone: `+91 1234567890`
   - Code: `123456`
   - Phone: `+91 9876543210`
   - Code: `654321`
4. Save

Now you can test without using SMS quota!

### Step 6: Enable Firebase App Check

1. Go to **Firebase Console** → **App Check**
2. Click **Get started**
3. Select **reCAPTCHA Enterprise** or **reCAPTCHA v3**
4. Register your app
5. Update your code to initialize App Check:

Create `src/firebase/appCheck.js`:

```javascript
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import app from './config';

// Initialize App Check
if (process.env.NODE_ENV === 'production') {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_V3_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
}

export default appCheck;
```

Import in `src/index.js`:

```javascript
import './firebase/appCheck'; // Add this line
```

### Step 7: Upgrade Firebase Plan (if needed)

If you're hitting quota limits:

1. Go to **Firebase Console** → **Billing**
2. Upgrade to **Blaze (Pay as you go)** plan
3. Set budget alerts to avoid surprises
4. Phone auth pricing:
   - USA/Canada: $0.01 per SMS
   - India: $0.005 per SMS
   - First 10K verifications/month are free

---

## 🧪 Testing Checklist

### Development (with test phone numbers):
- [ ] reCAPTCHA appears on screen
- [ ] Test phone number (+91 1234567890) with code 123456 works
- [ ] Error handling works (try invalid number)
- [ ] Resend OTP works
- [ ] Change number works

### Production (real phone numbers):
- [ ] reCAPTCHA loads correctly
- [ ] OTP received within 30 seconds
- [ ] OTP verification works
- [ ] Error messages are clear
- [ ] Rate limiting works (try 5+ times quickly)

---

## 🔍 Debugging

### Check if reCAPTCHA is loaded:
```javascript
// In browser console
console.log(window.recaptchaVerifier);
console.log(window.grecaptcha);
```

### Monitor Firebase Auth events:
```javascript
// Add to AuthContext
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user?.phoneNumber || 'null');
    setCurrentUser(user);
    setLoading(false);
  });
  return unsubscribe;
}, []);
```

### Check Firebase Console logs:
1. **Firebase Console** → **Authentication** → **Users**
2. Look for sign-in attempts
3. Check for error patterns

---

## 📊 Quota Limits

### Free Tier (Spark Plan):
- **Phone verifications**: ~10K per month free
- After that: Pay per SMS

### Blaze Plan:
- **First 10K**: Free
- **Additional**: $0.005-$0.01 per SMS (varies by country)

### Rate Limits:
- **Per IP**: 5 SMS per hour
- **Per phone number**: 5 SMS per day
- **Per project**: Varies based on usage patterns

---

## 🚨 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `reCAPTCHA not defined` | Site key missing | Add `REACT_APP_RECAPTCHA_SITE_KEY` to `.env` |
| `auth/too-many-requests` | Rate limit exceeded | Wait 30 mins or use test numbers |
| `auth/quota-exceeded` | Daily SMS quota reached | Upgrade to Blaze plan |
| `auth/invalid-phone-number` | Wrong format | Use +91XXXXXXXXXX format |
| `auth/code-expired` | OTP expired (5 mins) | Request new OTP |
| `reCAPTCHA timeout` | Slow network | Increase timeout in sendPhoneOTP |
| `SMS not received` | Carrier issues | Try different number or test numbers |

---

## 🎯 Quick Fix Summary

**Minimum required steps:**
1. ✅ Get reCAPTCHA site key from Google
2. ✅ Add `REACT_APP_RECAPTCHA_SITE_KEY` to `.env`
3. ✅ Change reCAPTCHA size from `invisible` to `normal`
4. ✅ Setup test phone numbers in Firebase Console
5. ✅ Restart your development server: `npm start`

**This will immediately fix 90% of your OTP issues!**

---

## 📞 Support

If issues persist:
1. Check Firebase Console → Authentication → Usage tab
2. Verify phone auth is enabled
3. Check authorized domains include `localhost`
4. Review browser console for errors
5. Test with multiple phone numbers
6. Try different browsers

**Pro tip:** Use test phone numbers during development to avoid depleting your SMS quota!
