import { useCallback } from 'react';
import { useDiceSkinContext } from '@/contexts/DiceSkinContext';
import { DiceSkinId } from '@/types/diceSkins';
import { getHolidaySkins, getRegularSkins } from '@/config/diceSkins';

// Hook for managing dice skin selection
export const useDiceSkins = () => {
  const { 
    currentSkin, 
    selectedSkinId, 
    allSkins, 
    setSkin,
    isUnlocked 
  } = useDiceSkinContext();

  const changeSkin = useCallback((skinId: DiceSkinId) => {
    if (isUnlocked(skinId)) {
      setSkin(skinId);
      return true;
    }
    return false;
  }, [setSkin, isUnlocked]);

  const getUnlockedSkins = useCallback(() => {
    return allSkins.filter(skin => isUnlocked(skin.id));
  }, [allSkins, isUnlocked]);

  const getLockedSkins = useCallback(() => {
    return allSkins.filter(skin => !isUnlocked(skin.id));
  }, [allSkins, isUnlocked]);

  return {
    currentSkin,
    selectedSkinId,
    allSkins,
    changeSkin,
    setSkin,
    isUnlocked,
    getUnlockedSkins,
    getLockedSkins,
    holidaySkins: getHolidaySkins(),
    regularSkins: getRegularSkins(),
  };
};
