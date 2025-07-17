"use client";

import { createContext, useContext, useState } from "react";

interface AuthContextProps {
  user: IUser | null;
  setAuthUser: (user: IUser | null) => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const setAuthUser = (user: IUser | null) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, setAuthUser }}>
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
