"use client";

import * as React from "react";
import * as auth from "@/lib/auth";

interface AuthContextType {
  user: auth.PublicUser | null;
  session: auth.Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: true; user: auth.PublicUser } | { success: false; error: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: true; user: auth.PublicUser } | { success: false; error: string }>;
  signOut: () => void;
  refresh: () => void;
  updateProfile: (updates: Partial<Pick<auth.User, "name" | "avatarDataUrl" | "bio">>) => Promise<{ success: true; user: auth.PublicUser } | { success: false; error: string }>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<auth.PublicUser | null>(null);
  const [session, setSession] = React.useState<auth.Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(() => {
    const currentSession = auth.getSession();
    const currentUser = auth.getCurrentUser();
    setSession(currentSession);
    setUser(currentUser);
  }, []);

  // Initialize on mount
  React.useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  // Sync across tabs via storage event
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "iu_session" || e.key === "iu_users") {
        refresh();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refresh]);

  const signInHandler = React.useCallback(async (email: string, password: string) => {
    const result = await auth.signIn(email, password);
    if (result.success) {
      refresh();
    }
    return result;
  }, [refresh]);

  const signUpHandler = React.useCallback(async (email: string, password: string, name: string) => {
    const result = await auth.signUp(email, password, name);
    if (result.success) {
      refresh();
    }
    return result;
  }, [refresh]);

  const signOutHandler = React.useCallback(() => {
    auth.signOut();
    refresh();
  }, [refresh]);

  const updateProfileHandler = React.useCallback(async (updates: Partial<Pick<auth.User, "name" | "avatarDataUrl" | "bio">>) => {
    const result = await auth.updateProfile(updates);
    if (result.success) {
      refresh();
    }
    return result;
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn: signInHandler,
        signUp: signUpHandler,
        signOut: signOutHandler,
        refresh,
        updateProfile: updateProfileHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
