# Firebase Authentication Setup Guide

This guide will help you set up Email/Password authentication for your Eaxy Store admin dashboard.

## ✅ What's Already Implemented

1. **Firebase SDK Installed** - `firebase` package added to dependencies
2. **Authentication Page Created** - Login page with email/password form
3. **Protected Routes** - Admin dashboard protected with authentication check
4. **Auth Context** - Centralized authentication state management
5. **User Profile** - Admin topbar shows user info and logout functionality

## 🔧 Firebase Console Setup

### Step 1: Create/Access Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** or select your existing project: `eaxy-store`
3. Follow the setup wizard if creating a new project

### Step 2: Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Email/Password** provider
3. Toggle **Enable** switch for Email/Password
4. (Optional) Enable **Email link (passwordless sign-in)** if needed
5. Click **Save**

### Step 3: Register Web App

1. In Firebase Console, go to **Project Settings** ⚙️
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `Eaxy Store Admin`
5. **Copy the Firebase configuration object**

### Step 4: Update Firebase Config

1. Open `src/firebase/config.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",               // From Firebase Console
  authDomain: "YOUR_AUTH_DOMAIN",       // Usually: projectId.firebaseapp.com
  projectId: "eaxy-store",              // Keep this or your project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Usually: projectId.appspot.com
  messagingSenderId: "YOUR_SENDER_ID",  // From Firebase Console
  appId: "YOUR_APP_ID"                  // From Firebase Console
};
```

### Step 5: Create Admin Users

Since this is email/password authentication, you need to create admin users:

#### Option A: Using Firebase Console (Recommended):

1. In Firebase Console → **Authentication** → **Users** tab
2. Click **Add user**
3. Enter email: `admin@eaxystore.com` (or your admin email)
4. Enter password: Create a strong password
5. Click **Add user**

#### Option B: Using Firebase CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Create user (you'll need to write a script or use the console)
```

### Step 6: Configure Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Add your domains:
   - `localhost` (for development - usually already there)
   - Your production domain when deploying

## 🎯 Testing Authentication

### Test Email/Password Sign-In:

1. Run your app: `npm start`
2. Navigate to `/login`
3. Enter the admin email and password you created
4. Click "Sign In"
5. Should redirect to `/admin` dashboard

**Test Credentials:**
- Email: The email you created in Firebase Console
- Password: The password you set for that user

## 🔐 Security Best Practices

1. **Never commit** `src/firebase/config.js` with real credentials to public repos
   - Add to `.gitignore` if needed
   - Use environment variables for production

2. **Use Strong Passwords**:
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Avoid common passwords

3. **Enable App Check** (Recommended):
   - In Firebase Console → **App Check**
   - Protects your backend resources from abuse

4. **Monitor Authentication**:
   - Firebase Console → **Authentication** → **Users**
   - Check for suspicious activity

5. **Set Password Policies**:
   - In Firebase Console → **Authentication** → **Settings**
   - Configure password strength requirements

6. **Enable Email Verification** (Optional):
   - Require users to verify their email before accessing admin

## 🚀 Authentication Flow

### Login Flow:
```
User visits /admin
  ↓
Not authenticated? → Redirect to /login
  ↓
Enter email and password → Click Sign In → Verify credentials → /admin
```

### Logout Flow:
```
User clicks profile icon in admin topbar
  ↓
User dropdown appears with name/email
  ↓
Click "Logout" → Confirm → Firebase signOut() → Redirect to /login
```

### Session Persistence:
- Firebase automatically maintains sessions
- Users stay logged in across page refreshes
- Sessions persist in browser storage
- Logout clears session completely

## 📂 File Structure

```
src/
├── firebase/
│   └── config.js              # Firebase configuration and initialization
├── contexts/
│   └── AuthContext.jsx        # Authentication state management
├── components/
│   └── auth/
│       └── ProtectedRoute.jsx # Route protection wrapper
├── pages/
│   └── LoginPage.jsx          # Login page with email/password form
└── admin/
    └── components/
        └── AdminTopBar.jsx    # Admin header with user menu and logout
```

## 🐛 Troubleshooting

### Issue: "Firebase: Error (auth/configuration-not-found)"
**Solution:** Make sure you've updated the Firebase config in `src/firebase/config.js` with your actual project credentials.

### Issue: "Invalid email or password"
**Solution:** 
- Verify the user exists in Firebase Console → Authentication → Users
- Check that you're entering the correct email and password
- Password is case-sensitive

### Issue: "User is not authenticated" after login
**Solution:**
- Check browser console for errors
- Verify Firebase config is correct
- Ensure Email/Password authentication is enabled in Firebase Console

### Issue: "Too many failed attempts"
**Solution:**
- Firebase temporarily blocks the account after multiple failed attempts
- Wait 10-15 minutes or reset the password
- Check Firebase Console → Authentication → Users for account status

## 📊 Firebase Quotas (Free Tier)

- **Email/Password Authentication**: Unlimited sign-ins
- **Monthly Active Users**: 50,000 (free tier)
- **User Management**: Unlimited users

For production, consider upgrading to Blaze plan for better quotas and support.

## 🔄 Next Steps

After completing setup:

1. Create admin user accounts in Firebase Console
2. Test login thoroughly with created accounts
3. Consider adding password reset functionality
4. Set up email verification for new users
5. Implement role-based access control (admin vs user roles)
6. Add two-factor authentication for extra security
7. Set up Firebase Analytics to track user behavior

## ⚙️ Additional Features to Implement (Optional)

### Password Reset:
- Add "Forgot Password?" link on login page
- Use Firebase `sendPasswordResetEmail()` method
- User receives email with reset link

### Email Verification:
- Verify user email before granting admin access
- Use Firebase `sendEmailVerification()` method

### Remember Me:
- Already implemented by Firebase
- Session persists based on browser settings

---

**Need Help?** Check Firebase documentation or console error messages for detailed debugging information.

## 🎨 UI Features

- Modern glassmorphism design
- Email and password input fields with icons
- Show/hide password toggle
- Responsive layout (mobile-friendly)
- Loading states for authentication
- Error handling with user-friendly messages
- User profile display with avatar
- Dropdown menu with logout option

All authentication screens follow your website's theme with the teal (#0f6b53) primary color!
