"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./auth-context";
import { pusherClient } from "@/lib/pusher-client";

interface PusherContextProps {
  channel: any;
}

const PusherContext = createContext<PusherContextProps | null>(null);

const PusherContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [channel, setChannel] = useState<any>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      const channel = pusherClient.subscribe(`private-user-${user._id}`);

      setChannel(channel);

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user]);

  return (
    <PusherContext.Provider value={{ channel }}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error(
      "PusherContext must be used within a PusherContextProvider"
    );
  }
  return context;
};

export default PusherContextProvider;
