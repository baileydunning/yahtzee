import { ClassicScores } from '@/types/game';

export const classicScoringEngine = {
  calculateUpperSection(scores: ClassicScores): number {
    const { aces, twos, threes, fours, fives, sixes } = scores;
    return (aces || 0) + (twos || 0) + (threes || 0) + 
           (fours || 0) + (fives || 0) + (sixes || 0);
  },

  calculateUpperBonus(upperTotal: number): number {
    return upperTotal >= 63 ? 35 : 0;
  },

  calculateLowerSection(scores: ClassicScores): number {
    const { threeOfKind, fourOfKind, fullHouse, smallStraight, 
            largeStraight, yahtzee, chance, bonusYahtzees } = scores;
    
    return (threeOfKind || 0) + (fourOfKind || 0) + (fullHouse || 0) +
           (smallStraight || 0) + (largeStraight || 0) + (yahtzee || 0) +
           (chance || 0) + (bonusYahtzees * 100);
  },

  calculateGrandTotal(scores: ClassicScores): number {
    const upperTotal = classicScoringEngine.calculateUpperSection(scores);
    const upperBonus = classicScoringEngine.calculateUpperBonus(upperTotal);
    const lowerTotal = classicScoringEngine.calculateLowerSection(scores);
    
    return upperTotal + upperBonus + lowerTotal;
  },

  // Scoring suggestions (for future dice rolling feature)
  scoreAces(dice: number[]): number {
    return dice.filter(d => d === 1).length * 1;
  },

  scoreTwos(dice: number[]): number {
    return dice.filter(d => d === 2).length * 2;
  },

  scoreThrees(dice: number[]): number {
    return dice.filter(d => d === 3).length * 3;
  },

  scoreFours(dice: number[]): number {
    return dice.filter(d => d === 4).length * 4;
  },

  scoreFives(dice: number[]): number {
    return dice.filter(d => d === 5).length * 5;
  },

  scoreSixes(dice: number[]): number {
    return dice.filter(d => d === 6).length * 6;
  },

  scoreThreeOfKind(dice: number[]): number {
    const counts = classicScoringEngine.countDice(dice);
    const hasThree = Object.values(counts).some((c: number) => c >= 3);
    return hasThree ? dice.reduce((a, b) => a + b, 0) : 0;
  },

  scoreFourOfKind(dice: number[]): number {
    const counts = classicScoringEngine.countDice(dice);
    const hasFour = Object.values(counts).some((c: number) => c >= 4);
    return hasFour ? dice.reduce((a, b) => a + b, 0) : 0;
  },

  scoreFullHouse(dice: number[]): number {
    const counts = Object.values(classicScoringEngine.countDice(dice)).sort();
    return counts.length === 2 && counts[0] === 2 && counts[1] === 3 ? 25 : 0;
  },

  scoreSmallStraight(dice: number[]): number {
    const sorted = [...new Set(dice)].sort();
    const straights = [
      [1, 2, 3, 4],
      [2, 3, 4, 5],
      [3, 4, 5, 6],
    ];
    
    return straights.some(straight => 
      straight.every(num => sorted.includes(num))
    ) ? 30 : 0;
  },

  scoreLargeStraight(dice: number[]): number {
    const sorted = [...new Set(dice)].sort().join('');
    return sorted === '12345' || sorted === '23456' ? 40 : 0;
  },

  scoreYahtzee(dice: number[]): number {
    return new Set(dice).size === 1 ? 50 : 0;
  },

  scoreChance(dice: number[]): number {
    return dice.reduce((a, b) => a + b, 0);
  },

  countDice(dice: number[]): Record<number, number> {
    return dice.reduce((acc, d) => {
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  },
};
