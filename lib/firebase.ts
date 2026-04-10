import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

let loginPromise: Promise<any> | null = null;

export const loginWithGoogle = async () => {
  if (loginPromise) return loginPromise;
  
  loginPromise = (async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-blocked') {
        console.warn("Login popup was cancelled or blocked. Please try again.");
      } else {
        console.error("Login error:", error);
      }
      throw error;
    } finally {
      loginPromise = null;
    }
  })();
  
  return loginPromise;
};

export const logout = () => signOut(auth);
