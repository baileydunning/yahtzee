export type GameMode = 'classic' | 'rainbow';
export type DiceColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface ClassicScores {
  aces: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  threeOfKind: number | null;
  fourOfKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  yahtzee: number | null;
  chance: number | null;
  bonusYahtzees: number;
}

export interface RainbowScores {
  // Standard Yahtzee categories (number-based)
  aces: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  threeOfKind: number | null;
  fourOfKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  yahtzee: number | null;
  chance: number | null;
  
  // Rainbow Mode bonus categories (color-based)
  allRed: number | null;
  allBlue: number | null;
  allGreen: number | null;
  allYellow: number | null;
  allPurple: number | null;
  threeColorMix: number | null;
  fourColorMix: number | null;
  rainbowBonus: number | null;
  
  bonusYahtzees: number;
}

export interface Player {
  id: string;
  name: string;
  classicScores: ClassicScores;
  rainbowScores: RainbowScores;
}

export interface TurnState {
  rollsLeft: number;
  heldDice: boolean[];
  currentDice: number[];
  currentColors: (DiceColor | 'neutral')[];
  hasRolled: boolean;
}

export interface GameState {
  id: string;
  mode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  turnState: TurnState;
  createdAt: string;
  updatedAt: string;
}

export interface HighScore {
  id: string;
  mode: GameMode;
  score: number;
  playerName: string;
  date: string;
  note?: string;
}
