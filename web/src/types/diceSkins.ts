export type DiceSkinId =
  | 'classic'
  | 'bubblegum-pink'
  | 'holographic'
  | 'neon-glow'
  | 'pixel'
  | 'metal'
  | 'wooden'
  | 'dungeon'
  | 'leafy-forest'
  | 'lava-core'
  | 'sky'
  | 'alien'
  | 'halloween'
  | 'christmas'
  | 'valentine'
  | 'newyear'
  | 'stpatrick'
  | 'easter'
  | 'hanukkah'
  | 'pride';


export interface DiceSkinClasses {
  die: string;      // base die style (background, border)
  pips: string;     // pip color/style
  held?: string;    // optional class for "held/locked" dice
  hovered?: string; // hover state
  shadow?: string;  // shadow styling
}

export interface DiceSkin {
  id: DiceSkinId;
  name: string;
  description?: string;
  classes: DiceSkinClasses;
  previewClass?: string;
  isHoliday?: boolean;
  isLocked?: boolean;
  unlockRequirement?: string;
}

export interface DiceSkinContextValue {
  currentSkin: DiceSkin;
  selectedSkinId: DiceSkinId;
  allSkins: DiceSkin[];
  setSkin: (id: DiceSkinId) => void;
  isUnlocked: (id: DiceSkinId) => boolean;
}
