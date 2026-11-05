import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with Google Drive scope
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

const provider = new GoogleAuthProvider();
provider.addScope(DRIVE_SCOPE);
provider.setCustomParameters({
  prompt: 'select_account',
});

// Flag to track sign-in in progress
let isSigningIn = false;

// Mandatory in-memory caching for OAuth access token (never saved to localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

/**
 * Initializes the Firebase Auth listener.
 * Clears in-memory token on sign-out or session end.
 */
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (user && !isSigningIn) {
      // User is logged into Firebase Auth, but in-memory OAuth token needs re-fetch if page was refreshed
      if (onAuthFailure) onAuthFailure();
    } else if (!user) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Initiates the Google Sign-In popup requesting access to Google Drive.
 * Stores the retrieved access token strictly in-memory.
 */
export const googleSignInWithDrive = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error('Falha ao obter o Access Token do Google Drive.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erro na autenticação com Google Drive:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieves the active in-memory Google Drive access token.
 */
export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Checks if the user is authenticated with an active Google Drive token in memory.
 */
export const isDriveAuthenticated = (): boolean => {
  return Boolean(cachedAccessToken);
};

/**
 * Signs the user out from Firebase and cleans up the in-memory access token.
 */
export const driveSignOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
  cachedAccessToken = null;
};
