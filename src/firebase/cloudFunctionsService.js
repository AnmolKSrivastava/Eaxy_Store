import { httpsCallable } from 'firebase/functions';
import { functions } from './config';

/**
 * Send admin invitation via Cloud Function
 * Creates Firebase Auth account and sends password setup email
 * 
 * @param {string} email - Email of the new admin
 * @param {string} role - Role (admin, superadmin, order_manager)
 * @param {string} displayName - Optional display name
 * @returns {Promise<{success: boolean, message: string, resetLink?: string}>}
 */
export async function sendAdminInviteViaCloudFunction(email, role, displayName = '') {
  try {
    const sendInvite = httpsCallable(functions, 'sendAdminInvite');
    const result = await sendInvite({ email, role, displayName });
    return result.data;
  } catch (error) {
    console.error('Error calling sendAdminInvite Cloud Function:', error);
    
    // Extract user-friendly error message
    if (error.code) {
      const errorMessages = {
        'functions/unauthenticated': 'You must be signed in to send invitations.',
        'functions/permission-denied': 'Only super admins can send admin invitations.',
        'functions/invalid-argument': error.message || 'Invalid invitation data provided.',
        'functions/already-exists': 'An admin with this email already exists.',
        'functions/resource-exhausted': 'Cannot add more than 4 super admins.',
        'functions/internal': error.message || 'Failed to send invitation. Please try again.',
      };
      
      throw new Error(errorMessages[error.code] || error.message || 'Failed to send invitation');
    }
    
    throw new Error(error.message || 'Failed to send admin invitation');
  }
}

/**
 * Revoke admin access via Cloud Function
 * Removes admin document and optionally disables Firebase Auth account
 * 
 * @param {string} email - Email of the admin to revoke
 * @param {boolean} disableAuthAccount - Whether to disable their auth account
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function revokeAdminAccessViaCloudFunction(email, disableAuthAccount = false) {
  try {
    const revokeAccess = httpsCallable(functions, 'revokeAdminAccess');
    const result = await revokeAccess({ email, disableAuthAccount });
    return result.data;
  } catch (error) {
    console.error('Error calling revokeAdminAccess Cloud Function:', error);
    
    if (error.code) {
      const errorMessages = {
        'functions/unauthenticated': 'You must be signed in.',
        'functions/permission-denied': 'Only super admins can revoke admin access.',
        'functions/invalid-argument': error.message || 'Invalid data provided.',
        'functions/internal': error.message || 'Failed to revoke access. Please try again.',
      };
      
      throw new Error(errorMessages[error.code] || error.message || 'Failed to revoke access');
    }
    
    throw new Error(error.message || 'Failed to revoke admin access');
  }
}
