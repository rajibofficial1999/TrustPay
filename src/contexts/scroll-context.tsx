"use client";

import { createContext, useContext, useState } from "react";

interface ScrollContextProps {
  isScrolled: boolean;
  scrollValue: number;
  handleSetScroll: (value: number) => void;
}

const ScrollContext = createContext<ScrollContextProps | null>(null);

const ScrollContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);

  const handleSetScroll = (value: number) => {
    setIsScrolled(value > 45);
    setScrollValue(value);
  };

  return (
    <ScrollContext.Provider
      value={{ isScrolled, handleSetScroll, scrollValue }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error(
      "useScrollContext must be used within a ScrollContextProvider"
    );
  }
  return context;
};

export default ScrollContextProvider;
