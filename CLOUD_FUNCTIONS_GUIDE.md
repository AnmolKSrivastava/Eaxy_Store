# Firebase Cloud Functions Deployment Guide

## Overview
This project now uses Firebase Cloud Functions to handle admin invitations. The Cloud Function automatically creates Firebase Auth accounts and sends password setup emails.

## Setup Steps

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Install Cloud Functions Dependencies
```bash
cd functions
npm install
cd ..
```

### 4. Configure Firebase Environment Variables (Optional)
Set your app URL for password reset links:
```bash
firebase functions:config:set app.url="https://your-app-url.web.app"
```

For local development:
```bash
firebase functions:config:set app.url="http://localhost:3000"
```

### 5. Deploy Cloud Functions
```bash
firebase deploy --only functions
```

Or deploy everything (Firestore rules, indexes, hosting, functions):
```bash
firebase deploy
```

## Testing Locally

### Run Functions Emulator
```bash
cd functions
npm run serve
```

This starts the Firebase emulator on http://localhost:5001

### Configure Frontend for Emulator
In `src/firebase/config.js`, add (for development only):
```javascript
import { connectFunctionsEmulator } from 'firebase/functions';

// After initializing functions
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

## Cloud Functions Available

### 1. `sendAdminInvite`
**Purpose:** Create admin user and send invitation email  
**Triggers:** HTTPS callable function  
**Parameters:**
- `email` (string, required): Admin email address
- `role` (string, required): 'admin', 'superadmin', or 'order_manager'
- `displayName` (string, optional): Display name for the user

**Returns:**
```json
{
  "success": true,
  "message": "Admin invitation sent to email@example.com",
  "resetLink": "https://..."
}
```

**Security:**
- Only super admins can call this function
- Validates role and email format
- Enforces super admin limit (max 4)
- Checks for existing admin accounts

### 2. `revokeAdminAccess`
**Purpose:** Remove admin access and optionally disable auth account  
**Triggers:** HTTPS callable function  
**Parameters:**
- `email` (string, required): Admin email to revoke
- `disableAuthAccount` (boolean, optional): Disable their Firebase Auth account

**Returns:**
```json
{
  "success": true,
  "message": "Admin access revoked for email@example.com"
}
```

## Email Configuration

### Firebase Email Templates
1. Go to Firebase Console → Authentication → Templates
2. Customize the "Password Reset" template
3. Update the action URL to point to your admin password setup page

### Custom Email Provider (Optional)
For production-grade emails with custom branding:
1. Integrate SendGrid, Mailgun, or Mailjet
2. Update `functions/index.js` to send custom HTML emails
3. Use Firebase Functions config to store API keys

## Monitoring

### View Function Logs
```bash
firebase functions:log
```

### View Logs in Console
https://console.firebase.google.com/project/YOUR_PROJECT/functions/logs

## Troubleshooting

### Function Not Found Error
- Ensure functions are deployed: `firebase deploy --only functions`
- Check function name in code matches deployed name
- Verify Firebase project is selected: `firebase use --add`

### Permission Denied
- User must be authenticated
- Verify super admin role in Firestore `admin` collection
- Check Firestore security rules allow admin reads

### Email Not Sending
- Verify Firebase project has email sending enabled
- Check spam folder
- Review Firebase Auth email templates
- Ensure action URL is correct in Firebase Console

### CORS Issues
- Cloud Functions automatically handle CORS for Firebase SDK
- For web requests, add CORS configuration to function

## Cost Considerations

Firebase Cloud Functions pricing:
- First 2 million invocations/month: FREE
- First 400,000 GB-seconds: FREE
- First 200,000 GHz-seconds: FREE

Admin invitations are low-frequency, so costs should remain in free tier.

## Next Steps

1. Deploy functions to Firebase
2. Test admin invitation flow
3. Customize email templates in Firebase Console
4. Set up monitoring and alerts
5. Consider adding SendGrid/Mailgun for production emails
