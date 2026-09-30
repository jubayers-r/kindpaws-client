"use client";

import { createContext } from "react";
import type { User, UserCredential } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  forgotPassword: (email: string) => Promise<void>;
  googleLogin: () => Promise<UserCredential>;
  githubLogin: () => Promise<UserCredential>;
  stateData: string | null;
  setStateData: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
