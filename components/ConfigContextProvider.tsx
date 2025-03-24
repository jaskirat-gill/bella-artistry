"use client";
import { MasterConfig } from "@/lib/types";
import { createContext, ReactNode, useContext } from "react";

const ConfigContext = createContext<MasterConfig | null>(null);

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigContextProvider");
  }
  return context;
}

export default function ConfigContextProvider({
  config,
  children,
}: {
  config: MasterConfig;
  children: ReactNode;
}) {
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}