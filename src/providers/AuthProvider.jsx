import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(true);

  // Sync user with MongoDB
  const syncUserWithMongoDB = async (firebaseUser) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }),
      });

      const data = await res.json();
      if (data.ok && data.user) {
        setUserRole(data.user.role || "user");
        return data.user;
      }
    } catch (err) {
      console.error("Failed to sync user with MongoDB:", err);
    }
    return null;
  };

  // register
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // login
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // google login
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync with MongoDB and get role
        await syncUserWithMongoDB(currentUser);
      } else {
        setUserRole("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    userRole,
    loading,
    createUser,
    signInUser,
    signInWithGoogle,
    logOut,
    syncUserWithMongoDB, // Export for manual sync if needed
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
