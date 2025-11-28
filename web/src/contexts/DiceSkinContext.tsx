import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { DiceSkinId, DiceSkinContextValue } from '@/types/diceSkins';
import { getAllSkins, getSkin, DEFAULT_SKIN_ID, DICE_SKIN_STORAGE_KEY } from '@/config/diceSkins';

const DiceSkinContext = createContext<DiceSkinContextValue | undefined>(undefined);

interface DiceSkinProviderProps {
  children: ReactNode;
}

export const DiceSkinProvider: React.FC<DiceSkinProviderProps> = ({ children }) => {
  const [selectedSkinId, setSelectedSkinId] = useState<DiceSkinId>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DICE_SKIN_STORAGE_KEY);
      if (stored && getAllSkins().some(s => s.id === stored)) {
        return stored as DiceSkinId;
      }
    }
    return DEFAULT_SKIN_ID;
  });

  const allSkins = getAllSkins();
  const currentSkin = getSkin(selectedSkinId);

  // Persist selection to localStorage
  useEffect(() => {
    localStorage.setItem(DICE_SKIN_STORAGE_KEY, selectedSkinId);
  }, [selectedSkinId]);

  const setSkin = useCallback((skinId: DiceSkinId) => {
    const skin = getSkin(skinId);
    if (!skin.isLocked) {
      setSelectedSkinId(skinId);
    }
  }, []);

  const isUnlocked = useCallback((skinId: DiceSkinId): boolean => {
    const skin = getSkin(skinId);
    if (!skin.isLocked) return true;
    
    const unlockedSkins = localStorage.getItem('yahtzee-unlocked-skins');
    if (unlockedSkins) {
      const unlocked = JSON.parse(unlockedSkins) as DiceSkinId[];
      return unlocked.includes(skinId);
    }
    
    return false;
  }, []);

  const value: DiceSkinContextValue = {
    currentSkin,
    selectedSkinId,
    allSkins,
    setSkin,
    isUnlocked,
  };

  return (
    <DiceSkinContext.Provider value={value}>
      {children}
    </DiceSkinContext.Provider>
  );
};

export const useDiceSkinContext = (): DiceSkinContextValue => {
  const context = useContext(DiceSkinContext);
  if (!context) {
    throw new Error('useDiceSkinContext must be used within a DiceSkinProvider');
  }
  return context;
};
