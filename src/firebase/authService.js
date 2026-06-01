import { auth } from './config';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

export async function signInWithEmailPassword(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function sendAdminPasswordResetEmail(email) {
  const continueUrl = `${window.location.origin}/admin/password-setup`;
  console.log('[authService] sendAdminPasswordResetEmail called for:', email);
  console.log('[authService] continueUrl:', continueUrl);
  console.log('[authService] auth.currentUser:', auth.currentUser?.email ?? 'null');
  const actionCodeSettings = {
    url: continueUrl,
    handleCodeInApp: false,
  };
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log('[authService] sendPasswordResetEmail resolved — email dispatched to Firebase servers');
  } catch (err) {
    console.error('[authService] sendPasswordResetEmail FAILED:', err.code, err.message);
    throw err;
  }
}

export async function confirmAdminPasswordReset(oobCode, newPassword) {
  await confirmPasswordReset(auth, oobCode, newPassword);
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated.');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}
