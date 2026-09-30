"use client";

import React, { useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/firebase/firebase.init";
import axios from "axios";
import { API_BASE_URL } from "@/lib/axiosSecure";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [stateData, setStateData] = useState<string | null>(null);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          await axios.post(
            `${API_BASE_URL}/api/jwt`,
            { firebaseToken: idToken },
            { withCredentials: true }
          );
        } catch (error) {
          console.error("JWT exchange failed:", error);
        }
      }
    });

    return () => unSubscribe();
  }, []);

  const createUser = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const logOut = () => signOut(auth);

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const googleLogin = () => signInWithPopup(auth, googleProvider);
  const githubLogin = () => signInWithPopup(auth, githubProvider);

  const forgotPassword = (email: string) => sendPasswordResetEmail(auth, email);

  const authInfo: AuthContextType = {
    user,
    setUser,
    loading,
    setLoading,
    logIn,
    logOut,
    createUser,
    forgotPassword,
    googleLogin,
    githubLogin,
    stateData,
    setStateData,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
