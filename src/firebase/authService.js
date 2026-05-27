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
  await sendPasswordResetEmail(auth, email);
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
