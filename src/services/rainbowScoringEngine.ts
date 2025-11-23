import { RainbowScores, DiceColor } from '@/types/game';

export const RAINBOW_COLORS: DiceColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export const rainbowScoringEngine = {
  calculateUpperSection(scores: RainbowScores): number {
    const { aces, twos, threes, fours, fives, sixes } = scores;
    return (aces || 0) + (twos || 0) + (threes || 0) + 
           (fours || 0) + (fives || 0) + (sixes || 0);
  },

  calculateUpperBonus(upperTotal: number): number {
    return upperTotal >= 63 ? 35 : 0;
  },

  calculateLowerSection(scores: RainbowScores): number {
    const { threeOfKind, fourOfKind, fullHouse, smallStraight, 
            largeStraight, yahtzee, chance, bonusYahtzees } = scores;
    
    return (threeOfKind || 0) + (fourOfKind || 0) + (fullHouse || 0) +
           (smallStraight || 0) + (largeStraight || 0) + (yahtzee || 0) +
           (chance || 0) + (bonusYahtzees * 100);
  },

  calculateColorBonus(scores: RainbowScores): number {
    const { allRed, allBlue, allGreen, allYellow, allPurple,
            threeColorMix, fourColorMix, rainbowBonus } = scores;
    
    return (allRed || 0) + (allBlue || 0) + (allGreen || 0) + 
           (allYellow || 0) + (allPurple || 0) + (threeColorMix || 0) +
           (fourColorMix || 0) + (rainbowBonus || 0);
  },

  calculateTotal(scores: RainbowScores): number {
    const upperTotal = rainbowScoringEngine.calculateUpperSection(scores);
    const upperBonus = rainbowScoringEngine.calculateUpperBonus(upperTotal);
    const lowerTotal = rainbowScoringEngine.calculateLowerSection(scores);
    const colorBonus = rainbowScoringEngine.calculateColorBonus(scores);
    
    return upperTotal + upperBonus + lowerTotal + colorBonus;
  },

  // Scoring functions for 5 colored dice
  scoreAllRed(dice: DiceColor[]): number {
    return dice.every(d => d === 'red') ? 50 : 0;
  },

  scoreAllBlue(dice: DiceColor[]): number {
    return dice.every(d => d === 'blue') ? 50 : 0;
  },

  scoreAllGreen(dice: DiceColor[]): number {
    return dice.every(d => d === 'green') ? 50 : 0;
  },

  scoreAllYellow(dice: DiceColor[]): number {
    return dice.every(d => d === 'yellow') ? 50 : 0;
  },

  scoreAllPurple(dice: DiceColor[]): number {
    return dice.every(d => d === 'purple') ? 50 : 0;
  },

  scoreThreeColorMix(dice: DiceColor[]): number {
    const uniqueColors = new Set(dice);
    return uniqueColors.size === 3 ? 20 : 0;
  },

  scoreFourColorMix(dice: DiceColor[]): number {
    const uniqueColors = new Set(dice);
    return uniqueColors.size === 4 ? 30 : 0;
  },

  scoreRainbowBonus(dice: DiceColor[]): number {
    const uniqueColors = new Set(dice);
    return uniqueColors.size === 5 ? 50 : 0;
  },

  countColors(dice: DiceColor[]): Record<DiceColor, number> {
    return dice.reduce((acc, color) => {
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {} as Record<DiceColor, number>);
  },
};
