"use client";

import { createContext, useContext, useState } from "react";

interface AuthUserProps {
  user: IUser | null;
  loading: boolean;
}

interface AuthContextProps {
  user: IUser | null;
  setAuthUser: ({ user, loading }: AuthUserProps) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  const setAuthUser = ({ user, loading }: AuthUserProps) => {
    setUser(user);
    setLoading(loading);
  };

  return (
    <AuthContext.Provider value={{ user, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
