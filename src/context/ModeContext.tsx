import React, { createContext, useContext, useState, useEffect } from "react";

export type FragranceMode = "ALL_FRAGRANCES" | "OUD_BASE" | "FLORAL_BASE" | "FRUITY_BASE" | "FRESH_BASE" | "DIVORCE_LOTION" | "ROLL_ON_PREMIUM" | "MESSI_EDITION";

interface ModeContextType {
  mode: FragranceMode | null;
  setMode: (mode: FragranceMode) => void;
  clearMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<FragranceMode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Every reload should prompt the user, so we don't load from localStorage
    setLoading(false);
  }, []);

  const setMode = (newMode: FragranceMode) => {
    setModeState(newMode);
  };

  const clearMode = () => {
    setModeState(null);
  };

  if (loading) {
    return null;
  }

  return (
    <ModeContext.Provider value={{ mode, setMode, clearMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
}
