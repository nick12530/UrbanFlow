import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // No Firebase config present; treat as unauthenticated but loaded
      setLoading(false);
      return () => {};
    }
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const ensureAuth = () => {
    if (!auth) throw new Error('Authentication is not configured. Missing Firebase environment variables.');
  };

  const login = (email, password) => {
    ensureAuth();
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, displayName) => {
    ensureAuth();
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      try {
        await updateProfile(credentials.user, { displayName });
      } catch (_) {
        // Ignore profile update errors silently
      }
    }
    return credentials;
  };

  const loginWithGoogle = () => {
    ensureAuth();
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    ensureAuth();
    return signOut(auth);
  };

  const value = { user, loading, login, register, loginWithGoogle, logout };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


