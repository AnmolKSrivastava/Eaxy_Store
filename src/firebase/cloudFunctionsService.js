import { auth } from './config';

/**
 * Send admin invitation via Cloud Function (HTTPS endpoint)
 * Creates Firebase Auth account and sends password setup email
 * 
 * @param {string} email - Email of the new admin
 * @param {string} role - Role (admin, superadmin, order_manager)
 * @param {string} displayName - Optional display name
 * @returns {Promise<{success: boolean, message: string, resetLink?: string}>}
 */
export async function sendAdminInviteViaCloudFunction(email, role, displayName = '') {
  try {
    // Get current user's ID token for authentication
    const user = auth.currentUser;
    if (!user) {
      throw new Error('You must be signed in to send invitations.');
    }
    
    const idToken = await user.getIdToken();
    
    const response = await fetch(
      'https://us-central1-eaxy-store.cloudfunctions.net/sendAdminInvite',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, role, displayName }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data.result;
  } catch (error) {
    console.error('Error calling sendAdminInvite Cloud Function:', error);
    throw new Error(error.message || 'Failed to send admin invitation');
  }
}

/**
 * Revoke admin access via Cloud Function (HTTPS endpoint)
 * Removes admin document and optionally disables Firebase Auth account
 * 
 * @param {string} email - Email of the admin to revoke
 * @param {boolean} disableAuthAccount - Whether to disable their auth account
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function revokeAdminAccessViaCloudFunction(email, disableAuthAccount = false) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('You must be signed in.');
    }
    
    const idToken = await user.getIdToken();
    
    const response = await fetch(
      'https://us-central1-eaxy-store.cloudfunctions.net/revokeAdminAccess',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, disableAuthAccount }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data.result;
  } catch (error) {
    console.error('Error calling revokeAdminAccess Cloud Function:', error);
    throw new Error(error.message || 'Failed to revoke admin access');
  }
}
