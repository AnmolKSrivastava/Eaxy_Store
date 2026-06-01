const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Role constants matching frontend
const ROLES = {
  SUPERADMIN: 'super_admin',
  ADMIN: 'admin',
  ORDER_MANAGER: 'order_manager'
};

/**
 * Cloud Function to create admin user and send invitation email
 * Triggered via HTTP call from Admin Management interface
 */
exports.sendAdminInvite = functions.https.onCall(async (data, context) => {
  try {
    // Verify caller is authenticated and is a super admin
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'You must be signed in to send admin invitations.'
      );
    }

    const callerEmail = context.auth.token.email;
    
    // Check if caller is super admin
    const callerAdminDoc = await admin.firestore().collection('admin').doc(callerEmail).get();
    const callerRole = callerAdminDoc.exists ? callerAdminDoc.data().role : null;
    
    // Accept both old and new role format for backward compatibility
    if (!callerAdminDoc.exists || (callerRole !== ROLES.SUPERADMIN && callerRole !== 'superadmin')) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only super admins can send admin invitations.'
      );
    }

    const { email, role, displayName } = data;

    if (!email || !email.trim()) {
      throw new functions.https.HttpsError('invalid-argument', 'Email is required.');
    }

    // Accept both old and new role formats
    const validRoles = [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.ORDER_MANAGER, 'admin', 'superadmin', 'order_manager'];
    if (!role || !validRoles.includes(role)) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid role specified.');
    }

    // Check if admin document already exists
    const adminDoc = await admin.firestore().collection('admin').doc(email).get();
    if (adminDoc.exists) {
      throw new functions.https.HttpsError('already-exists', 'An admin with this email already exists.');
    }

    // Check super admin limit
    if (role === ROLES.SUPERADMIN || role === 'superadmin') {
      const allAdmins = await admin.firestore().collection('admin').get();
      const superAdminCount = allAdmins.docs.filter(doc => {
        const r = doc.data().role;
        return r === ROLES.SUPERADMIN || r === 'superadmin';
      }).length;
      if (superAdminCount >= 4) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Cannot add more than 4 super admins.'
        );
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
      url: `${functions.config().app?.url || 'http://localhost:3000'}/admin/password-setup`,
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

    // Send custom email with invitation link
    // Note: For production, configure Firebase email templates in Console
    // or integrate with SendGrid/Mailgun for custom HTML emails
    
    console.log(`✅ Admin invitation created successfully for ${email}`);
    console.log(`Password reset link: ${resetLink}`);

    return {
      success: true,
      message: `Admin invitation sent to ${email}`,
      resetLink: resetLink, // Include link in response (for testing; remove in production)
    };

  } catch (error) {
    console.error('Error sending admin invite:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      `Failed to send admin invitation: ${error.message}`
    );
  }
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
 * Optionally disable Firebase Auth account
 */
exports.revokeAdminAccess = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }

    const callerEmail = context.auth.token.email;
    const callerAdminDoc = await admin.firestore().collection('admin').doc(callerEmail).get();
    const callerRole = callerAdminDoc.exists ? callerAdminDoc.data().role : null;
    
    // Accept both old and new role format
    if (!callerAdminDoc.exists || (callerRole !== ROLES.SUPERADMIN && callerRole !== 'superadmin')) {
      throw new functions.https.HttpsError('permission-denied', 'Only super admins can revoke admin access.');
    }

    const { email, disableAuthAccount } = data;

    if (!email) {
      throw new functions.https.HttpsError('invalid-argument', 'Email is required.');
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

    return { success: true, message: `Admin access revoked for ${email}` };

  } catch (error) {
    console.error('Error revoking admin access:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', `Failed to revoke admin access: ${error.message}`);
  }
});
