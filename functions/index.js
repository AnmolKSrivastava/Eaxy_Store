const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// Role constants matching frontend
const ROLES = {
  SUPERADMIN: 'super_admin',
  ADMIN: 'admin',
  ORDER_MANAGER: 'order_manager'
};

/**
 * Verify Firebase ID token and get user email
 */
async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided');
  }
  
  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken.email;
}

/**
 * Cloud Function to create admin user and send invitation email
 * Now using HTTPS endpoint with CORS for better compatibility
 */
exports.sendAdminInvite = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Only accept POST requests
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      // Verify authentication
      let callerEmail;
      try {
        callerEmail = await verifyAuth(req);
      } catch (error) {
        return res.status(401).json({ error: 'Unauthenticated: ' + error.message });
      }

      // Check if caller is super admin
      const callerAdminDoc = await admin.firestore().collection('admin').doc(callerEmail).get();
      const callerRole = callerAdminDoc.exists ? callerAdminDoc.data().role : null;
      
      // Accept both old and new role format for backward compatibility
      if (!callerAdminDoc.exists || (callerRole !== ROLES.SUPERADMIN && callerRole !== 'superadmin')) {
        return res.status(403).json({ error: 'Permission denied: Only super admins can send admin invitations' });
      }

      const { email, role, displayName } = req.body.data || req.body;

      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Accept both old and new role formats
      const validRoles = [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.ORDER_MANAGER, 'admin', 'superadmin', 'order_manager'];
      if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }

      // Check if admin document already exists
      const adminDoc = await admin.firestore().collection('admin').doc(email).get();
      if (adminDoc.exists) {
        return res.status(409).json({ error: 'An admin with this email already exists' });
      }

      // Check super admin limit
      if (role === ROLES.SUPERADMIN || role === 'superadmin') {
        const allAdmins = await admin.firestore().collection('admin').get();
        const superAdminCount = allAdmins.docs.filter(doc => {
          const r = doc.data().role;
          return r === ROLES.SUPERADMIN || r === 'superadmin';
        }).length;
        if (superAdminCount >= 4) {
          return res.status(429).json({ error: 'Cannot add more than 4 super admins' });
        }
      }

      // Try to get existing user or create new one
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(email);
        console.log(`User ${email} already exists in Firebase Auth.`);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // Create new Firebase Auth user with random temporary password
          const tempPassword = generateSecurePassword();
          userRecord = await admin.auth().createUser({
            email: email,
            password: tempPassword,
            displayName: displayName || email.split('@')[0],
            emailVerified: false,
          });
          console.log(`Created Firebase Auth user: ${email}`);
        } else {
          throw error;
        }
      }

      // Generate password reset link (valid for 1 hour)
      const actionCodeSettings = {
        url: `${functions.config().app?.url || 'https://eaxy-store.web.app'}/admin/password-setup`,
        handleCodeInApp: false,
      };

      const resetLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);

      // Create admin document in Firestore
      await admin.firestore().collection('admin').doc(email).set({
        role: role,
        addedBy: callerEmail,
        addedAt: new Date().toISOString(),
        active: true,
        uid: userRecord.uid,
      });

      // Log activity
      await admin.firestore().collection('activity_logs').add({
        type: 'admin_added',
        description: `Added ${email} as ${role}`,
        performedBy: callerEmail,
        timestamp: new Date().toISOString(),
      });

      console.log(`✅ Admin invitation created successfully for ${email}`);
      console.log(`Password reset link: ${resetLink}`);

      return res.status(200).json({
        result: {
          success: true,
          message: `Admin invitation sent to ${email}`,
          resetLink: resetLink,
        }
      });

    } catch (error) {
      console.error('Error sending admin invite:', error);
      return res.status(500).json({ error: `Failed to send admin invitation: ${error.message}` });
    }
  });
});

/**
 * Generate a secure random password
 */
function generateSecurePassword() {
  const length = 20;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  return password;
}

/**
 * Cloud Function to revoke admin access
 * Now using HTTPS endpoint with CORS
 */
exports.revokeAdminAccess = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      // Verify authentication
      let callerEmail;
      try {
        callerEmail = await verifyAuth(req);
      } catch (error) {
        return res.status(401).json({ error: 'Unauthenticated: ' + error.message });
      }

      const callerAdminDoc = await admin.firestore().collection('admin').doc(callerEmail).get();
      const callerRole = callerAdminDoc.exists ? callerAdminDoc.data().role : null;
      
      // Accept both old and new role format
      if (!callerAdminDoc.exists || (callerRole !== ROLES.SUPERADMIN && callerRole !== 'superadmin')) {
        return res.status(403).json({ error: 'Permission denied: Only super admins can revoke admin access' });
      }

      const { email, disableAuthAccount } = req.body.data || req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Delete admin document
      await admin.firestore().collection('admin').doc(email).delete();

      // Optionally disable Firebase Auth account
      if (disableAuthAccount) {
        try {
          const userRecord = await admin.auth().getUserByEmail(email);
          await admin.auth().updateUser(userRecord.uid, { disabled: true });
        } catch (error) {
          console.warn(`Could not disable auth account for ${email}:`, error.message);
        }
      }

      // Log activity
      await admin.firestore().collection('activity_logs').add({
        type: 'admin_removed',
        description: `Removed admin access for ${email}`,
        performedBy: callerEmail,
        timestamp: new Date().toISOString(),
      });

      return res.status(200).json({
        result: {
          success: true,
          message: `Admin access revoked for ${email}`
        }
      });

    } catch (error) {
      console.error('Error revoking admin access:', error);
      return res.status(500).json({ error: `Failed to revoke admin access: ${error.message}` });
    }
  });
});
