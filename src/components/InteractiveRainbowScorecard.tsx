import { RainbowScores, DiceColor } from '@/types/game';
import { rainbowScoringEngine } from '@/services/rainbowScoringEngine';
import { classicScoringEngine } from '@/services/scoringEngine';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface InteractiveRainbowScorecardProps {
  scores: RainbowScores;
  currentDice: number[];
  currentColors: DiceColor[];
  canScore: boolean;
  onScoreSelect: (category: keyof RainbowScores, value: number) => void;
  playerName: string;
}

export const InteractiveRainbowScorecard = ({
  scores,
  currentDice,
  currentColors,
  canScore,
  onScoreSelect,
  playerName,
}: InteractiveRainbowScorecardProps) => {
  const upperTotal = rainbowScoringEngine.calculateUpperSection(scores);
  const upperBonus = rainbowScoringEngine.calculateUpperBonus(upperTotal);
  const lowerTotal = rainbowScoringEngine.calculateLowerSection(scores);
  const colorBonus = rainbowScoringEngine.calculateColorBonus(scores);
  const grandTotal = rainbowScoringEngine.calculateTotal(scores);

  const ScoreRow = ({
    label,
    category,
    scoreFunction,
    color,
  }: {
    label: string;
    category: keyof RainbowScores;
    scoreFunction: ((dice: number[]) => number) | ((colors: DiceColor[]) => number);
    color?: string;
  }) => {
    const isUsed = scores[category] !== null;
    
    const isColorCategory = ['allRed', 'allBlue', 'allGreen', 'allYellow', 'allPurple', 
                             'threeColorMix', 'fourColorMix', 'rainbowBonus'].includes(category);
    
    const potentialScore = !isUsed && canScore 
      ? isColorCategory 
        ? (scoreFunction as (colors: DiceColor[]) => number)(currentColors)
        : (scoreFunction as (dice: number[]) => number)(currentDice)
      : null;
    
    const actualScore = scores[category];
    const canSelect = !isUsed && canScore;

    return (
      <button
        onClick={() => {
          if (canSelect && potentialScore !== null) {
            onScoreSelect(category, potentialScore);
          }
        }}
        disabled={!canSelect}
        className={cn(
          'w-full grid grid-cols-[1fr_auto_auto] gap-3 items-center py-3 px-4 border-b border-border last:border-0 transition-all duration-150',
          canSelect && potentialScore !== null && potentialScore > 0 && 'hover:bg-gray-100 cursor-pointer',
          canSelect && potentialScore === 0 && 'hover:bg-gray-50 cursor-pointer opacity-60',
          isUsed && 'bg-gray-50',
          !canSelect && !isUsed && 'cursor-not-allowed opacity-40'
        )}
      >
        <span className="text-left text-sm md:text-base font-medium text-foreground flex items-center gap-2">
          {isUsed && <Check className="w-4 h-4 text-gray-700" />}
          {color && <span className={`w-3 h-3 rounded-full bg-dice-${color} border border-gray-300`}></span>}
          {label}
        </span>
        
        <span className={cn(
          'text-sm md:text-base font-semibold text-right min-w-[3rem]',
          canSelect && potentialScore !== null && potentialScore > 0 ? 'text-gray-900' : 'text-gray-400'
        )}>
          {canSelect && potentialScore !== null ? potentialScore : '—'}
        </span>
        
        <span className={cn(
          'text-sm md:text-base font-bold text-right min-w-[3rem]',
          isUsed ? 'text-gray-900' : 'text-gray-300'
        )}>
          {isUsed ? actualScore : '—'}
        </span>
      </button>
    );
  };

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4">
        <h2 className="text-xl md:text-2xl font-bold">{playerName}</h2>
        <p className="text-sm text-gray-400">Rainbow Mode</p>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-2 px-4 bg-gray-100 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase">
        <span>Category</span>
        <span className="text-right min-w-[3rem]">Preview</span>
        <span className="text-right min-w-[3rem]">Score</span>
      </div>

      {/* Upper Section */}
      <div className="border-b-4 border-gray-300">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Upper Section</h3>
        </div>
        <div>
          <ScoreRow label="Aces (1s)" category="aces" scoreFunction={classicScoringEngine.scoreAces} />
          <ScoreRow label="Twos (2s)" category="twos" scoreFunction={classicScoringEngine.scoreTwos} />
          <ScoreRow label="Threes (3s)" category="threes" scoreFunction={classicScoringEngine.scoreThrees} />
          <ScoreRow label="Fours (4s)" category="fours" scoreFunction={classicScoringEngine.scoreFours} />
          <ScoreRow label="Fives (5s)" category="fives" scoreFunction={classicScoringEngine.scoreFives} />
          <ScoreRow label="Sixes (6s)" category="sixes" scoreFunction={classicScoringEngine.scoreSixes} />
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-300">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="font-semibold text-gray-700">Upper Total</span>
            <span className="font-bold text-gray-900">{upperTotal}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-700">Bonus (63+)</span>
            <span className="font-bold text-gray-900">{upperBonus > 0 ? `+${upperBonus}` : '—'}</span>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="border-b-4 border-gray-300">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Lower Section</h3>
        </div>
        <div>
          <ScoreRow label="3 of a Kind" category="threeOfKind" scoreFunction={classicScoringEngine.scoreThreeOfKind} />
          <ScoreRow label="4 of a Kind" category="fourOfKind" scoreFunction={classicScoringEngine.scoreFourOfKind} />
          <ScoreRow label="Full House" category="fullHouse" scoreFunction={classicScoringEngine.scoreFullHouse} />
          <ScoreRow label="Small Straight" category="smallStraight" scoreFunction={classicScoringEngine.scoreSmallStraight} />
          <ScoreRow label="Large Straight" category="largeStraight" scoreFunction={classicScoringEngine.scoreLargeStraight} />
          <ScoreRow label="Yahtzee" category="yahtzee" scoreFunction={classicScoringEngine.scoreYahtzee} />
          <ScoreRow label="Chance" category="chance" scoreFunction={classicScoringEngine.scoreChance} />
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-300">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="font-semibold text-gray-700">Bonus Yahtzees</span>
            <span className="text-xs text-gray-600">{scores.bonusYahtzees} × 100</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-700">Lower Total</span>
            <span className="font-bold text-gray-900">{lowerTotal}</span>
          </div>
        </div>
      </div>

      {/* Rainbow Bonus Section */}
      <div className="border-b-4 border-gray-300">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">🌈 Color Bonuses</h3>
        </div>
        
        <div>
          <ScoreRow label="All Red" category="allRed" scoreFunction={rainbowScoringEngine.scoreAllRed} color="red" />
          <ScoreRow label="All Blue" category="allBlue" scoreFunction={rainbowScoringEngine.scoreAllBlue} color="blue" />
          <ScoreRow label="All Green" category="allGreen" scoreFunction={rainbowScoringEngine.scoreAllGreen} color="green" />
          <ScoreRow label="All Yellow" category="allYellow" scoreFunction={rainbowScoringEngine.scoreAllYellow} color="yellow" />
          <ScoreRow label="All Purple" category="allPurple" scoreFunction={rainbowScoringEngine.scoreAllPurple} color="purple" />
          <ScoreRow label="3-Color Mix" category="threeColorMix" scoreFunction={rainbowScoringEngine.scoreThreeColorMix} />
          <ScoreRow label="4-Color Mix" category="fourColorMix" scoreFunction={rainbowScoringEngine.scoreFourColorMix} />
          <ScoreRow label="Rainbow (5 colors)" category="rainbowBonus" scoreFunction={rainbowScoringEngine.scoreRainbowBonus} />
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-300">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-700">Color Bonus Total</span>
            <span className="font-bold text-gray-900">{colorBonus}</span>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">TOTAL SCORE</span>
          <span className="text-3xl font-bold">{grandTotal}</span>
        </div>
      </div>
    </Card>
  );
};
