# Separate Login Modals Setup

## Overview
The authentication system now has **separate login flows** for regular users and administrators:

### 👥 User Login (via Navbar)
- **Location**: Navbar "Login" button (top right)
- **Methods**: 
  - Google SSO
  - Phone OTP
- **Component**: `UserLoginModal`
- **Purpose**: Customer accounts for shopping, orders, and profile management

### 🛡️ Admin Login (separate route)
- **Location**: `/admin-login` route or link from UserLoginModal footer
- **Method**: Email & Password only
- **Component**: `LoginPage` (full page) or `AdminLoginModal` (modal version available)
- **Purpose**: Administrative access to manage store, orders, products, etc.

---

## Implementation Details

### User Login Flow
1. User clicks "Login" button in navbar
2. `UserLoginModal` opens with two options:
   - **Google Sign-In**: One-click authentication with Google account
   - **Phone Sign-In**: Opens `PhoneAuthModal` for OTP verification
3. Upon successful authentication, modal closes and user is logged in

### Admin Login Flow
1. Admin navigates to `/admin-login` (or clicks "Admin? Sign in here" in UserLoginModal)
2. Email/password login page appears (`LoginPage.jsx`)
3. After successful login, redirected to `/admin` dashboard
4. Protected routes automatically redirect to `/admin-login` if not authenticated

---

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── UserLoginModal.jsx          # User login modal (Google + Phone)
│   │   ├── UserLoginModal.css
│   │   ├── AdminLoginModal.jsx         # Admin login modal (Email/Password)
│   │   ├── AdminLoginModal.css
│   │   ├── PhoneAuthModal.jsx          # Phone OTP verification
│   │   └── ProtectedRoute.jsx          # Redirects to /admin-login
│   └── layout/
│       └── Navbar.jsx                   # Opens UserLoginModal
├── contexts/
│   └── AuthContext.jsx                  # Authentication methods
├── firebase/
│   └── config.js                        # Firebase config with GoogleAuthProvider
└── pages/
    └── LoginPage.jsx                    # Admin login page at /admin-login
```

---

## Firebase Configuration Required

### 1. Enable Authentication Methods in Firebase Console

#### For User Login (Google + Phone):
1. Go to **Firebase Console** → **Authentication** → **Sign-in method**
2. Enable **Google**:
   - Click on Google provider
   - Enable the provider
   - Set support email
   - Save
3. Enable **Phone**:
   - Click on Phone provider
   - Enable the provider
   - Save

#### For Admin Login (Email/Password):
1. Already enabled if you followed previous setup
2. Verify: **Email/Password** provider is enabled

### 2. Update Firebase Config
Replace placeholder values in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // From Firebase Console
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "eaxy-store",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Where to find these values:**
- Firebase Console → Project Settings → General → Your apps → Web app

### 3. Create Admin User Account
Admin accounts must be created manually in Firebase Console:

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter admin email and password
4. Save

**Note**: Regular users will be created automatically when they sign in with Google or Phone.

---

## AuthContext Methods

### User Methods
```javascript
const { signInWithGoogle, setupRecaptcha, sendPhoneOTP } = useAuth();

// Google Sign-In
await signInWithGoogle();

// Phone Sign-In (two steps)
const recaptchaVerifier = setupRecaptcha('recaptcha-container-id');
const confirmationResult = await sendPhoneOTP('+1234567890', recaptchaVerifier);
await confirmationResult.confirm(otpCode);
```

### Admin Methods
```javascript
const { signInWithEmail } = useAuth();

// Admin Sign-In
await signInWithEmail('admin@eaxystore.com', 'password');
```

### Common Methods
```javascript
const { logout, currentUser, isAuthenticated } = useAuth();

// Logout (works for both users and admin)
await logout();

// Check auth state
if (isAuthenticated) {
  console.log('Logged in as:', currentUser.email);
}
```

---

## Usage Examples

### Open User Login Modal from Custom Component
```jsx
import { useState } from 'react';
import UserLoginModal from './components/auth/UserLoginModal';

function MyComponent() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <button onClick={() => setShowLogin(true)}>
        Sign In
      </button>
      <UserLoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </>
  );
}
```

### Open Admin Login Modal from Custom Component
```jsx
import { useState } from 'react';
import AdminLoginModal from './components/auth/AdminLoginModal';

function AdminButton() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <>
      <button onClick={() => setShowAdminLogin(true)}>
        Admin Login
      </button>
      <AdminLoginModal 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
      />
    </>
  );
}
```

### Check User Type
```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { currentUser } = useAuth();

  // Admin users will have email addresses
  // Regular users might have Google accounts or phone numbers
  const isAdmin = currentUser?.email && !currentUser.providerData.some(p => p.providerId === 'google.com');

  return (
    <div>
      {isAdmin ? 'Admin User' : 'Regular User'}
    </div>
  );
}
```

---

## Routes

| Route | Component | Purpose | Protected |
|-------|-----------|---------|-----------|
| `/` | HomePage | Main landing page | No |
| `/products` | ProductsPage | Product catalog | No |
| `/repair-services` | RepairServicesPage | Repair services | No |
| `/contact` | ContactPage | Contact form | No |
| `/wishlist` | WishlistPage | User wishlist | No |
| `/cart` | CartPage | Shopping cart | No |
| `/admin-login` | LoginPage | Admin login page | No |
| `/admin` | AdminDashboardPage | Admin dashboard | Yes (Admin) |

---

## Security Considerations

### Separating User Types
- **Admin access**: Only through email/password at `/admin-login`
- **User access**: Through Google SSO or Phone OTP via navbar modal
- **Admin route protection**: `/admin` checks authentication via `ProtectedRoute`

### Best Practices
1. **Admin Emails**: Use company email domain (e.g., `admin@eaxystore.com`)
2. **Strong Passwords**: Enforce strong passwords for admin accounts
3. **Regular Users**: Let Firebase handle Google/Phone authentication security
4. **Role-Based Access**: Consider adding custom claims in Firebase for role management:
   ```javascript
   // Set admin claim in Firebase Admin SDK (backend)
   admin.auth().setCustomUserClaims(uid, { admin: true });
   ```

---

## Testing

### Test User Login
1. Click "Login" button in navbar
2. Click "Continue with Google"
3. Select Google account
4. Verify modal closes and user is authenticated

### Test Phone Login
1. Click "Login" button in navbar
2. Click "Continue with Phone"
3. Enter phone number with country code
4. Enter OTP received via SMS
5. Verify authentication

### Test Admin Login
1. Navigate to `/admin-login`
2. Enter admin email and password
3. Verify redirect to `/admin` dashboard
4. Test logout functionality

### Test Protected Routes
1. While logged out, navigate to `/admin`
2. Verify redirect to `/admin-login`
3. Log in as admin
4. Navigate to `/admin` - should work
5. Logout
6. Navigate to `/admin` - redirected to `/admin-login` again

---

## Troubleshooting

### Google Sign-In Issues
- **Pop-up blocked**: Enable pop-ups for your site
- **Unauthorized domain**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Phone Authentication Issues
- **reCAPTCHA not working**: Ensure `setupRecaptcha()` is called before `sendPhoneOTP()`
- **Invalid phone number**: Use international format with country code (+1234567890)
- **SMS not received**: Check phone number, try test phone numbers in Firebase Console for development

### Admin Login Issues
- **Invalid credentials**: Verify email/password in Firebase Console → Authentication → Users
- **Not redirecting**: Check `ProtectedRoute` component and `/admin-login` route

---

## Next Steps

1. ✅ Enable Google and Phone authentication in Firebase Console
2. ✅ Update Firebase config in `src/firebase/config.js`
3. ✅ Create admin user accounts in Firebase Console
4. ✅ Test both user and admin login flows
5. ⏭️ Consider adding user profile pages
6. ⏭️ Implement role-based permissions
7. ⏭️ Add "Forgot Password" for admin accounts
8. ⏭️ Add user dashboard for regular customers
