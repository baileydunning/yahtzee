import { useEffect, useMemo } from 'react';
import { DiceColor } from '@/types/game';
import { classicScoringEngine } from '@/services/scoringEngine';
import { rainbowScoringEngine } from '@/services/rainbowScoringEngine';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Target } from 'lucide-react';

// Category metadata for display
const CATEGORY_INFO: Record<string, { label: string; color?: string }> = {
  // Upper section
  aces: { label: 'Aces (1s)' },
  twos: { label: 'Twos (2s)' },
  threes: { label: 'Threes (3s)' },
  fours: { label: 'Fours (4s)' },
  fives: { label: 'Fives (5s)' },
  sixes: { label: 'Sixes (6s)' },
  // Lower section
  threeOfKind: { label: '3 of a Kind' },
  fourOfKind: { label: '4 of a Kind' },
  fullHouse: { label: 'Full House' },
  smallStraight: { label: 'Small Straight' },
  largeStraight: { label: 'Large Straight' },
  yahtzee: { label: 'Yahtzee' },
  chance: { label: 'Chance' },
  // Rainbow colors
  allRed: { label: 'All Red', color: 'red' },
  allBlue: { label: 'All Blue', color: 'blue' },
  allGreen: { label: 'All Green', color: 'green' },
  allYellow: { label: 'All Yellow', color: 'yellow' },
  allPurple: { label: 'All Purple', color: 'purple' },
  threeColorMix: { label: '3-Color Mix' },
  fourColorMix: { label: '4-Color Mix' },
  rainbowBonus: { label: 'Rainbow (5 colors)' },
};

// Score functions mapping
const getScoreFunction = (category: string, isRainbow: boolean) => {
  const classicFunctions: Record<string, (dice: number[]) => number> = {
    aces: classicScoringEngine.scoreAces,
    twos: classicScoringEngine.scoreTwos,
    threes: classicScoringEngine.scoreThrees,
    fours: classicScoringEngine.scoreFours,
    fives: classicScoringEngine.scoreFives,
    sixes: classicScoringEngine.scoreSixes,
    threeOfKind: classicScoringEngine.scoreThreeOfKind,
    fourOfKind: classicScoringEngine.scoreFourOfKind,
    fullHouse: classicScoringEngine.scoreFullHouse,
    smallStraight: classicScoringEngine.scoreSmallStraight,
    largeStraight: classicScoringEngine.scoreLargeStraight,
    yahtzee: classicScoringEngine.scoreYahtzee,
    chance: classicScoringEngine.scoreChance,
  };

  const rainbowColorFunctions: Record<string, (colors: DiceColor[]) => number> =
    {
      allRed: rainbowScoringEngine.scoreAllRed,
      allBlue: rainbowScoringEngine.scoreAllBlue,
      allGreen: rainbowScoringEngine.scoreAllGreen,
      allYellow: rainbowScoringEngine.scoreAllYellow,
      allPurple: rainbowScoringEngine.scoreAllPurple,
      threeColorMix: rainbowScoringEngine.scoreThreeColorMix,
      fourColorMix: rainbowScoringEngine.scoreFourColorMix,
      rainbowBonus: rainbowScoringEngine.scoreRainbowBonus,
    };

  return {
    fn: classicFunctions[category] || rainbowColorFunctions[category],
    isColorBased: !!rainbowColorFunctions[category],
  };
};

interface PuzzleScorecardProps {
  requiredCategories: string[];
  completedCategories: Record<string, number>;
  currentDice: number[];
  currentColors?: DiceColor[];
  canScore: boolean;
  onScoreSelect: (category: string, value: number) => void;
  isRainbow: boolean;

  // New bits:
  isFinalRoll: boolean;
  onOnlyZeroAvailable?: () => void;
  objectiveType?: string;                // e.g. 'category_minimum', 'specific_category', etc.
  objectiveValue?: number | string | string[];
}

export const PuzzleScorecard = ({
  requiredCategories,
  completedCategories,
  currentDice,
  currentColors = [],
  canScore,
  onScoreSelect,
  isRainbow,
  isFinalRoll,
  onOnlyZeroAvailable,
  objectiveType,
  objectiveValue,
}: PuzzleScorecardProps) => {
  const totalScore = Object.values(completedCategories).reduce(
    (sum, val) => sum + val,
    0
  );
  const completedCount = Object.keys(completedCategories).length;
  const totalRequired = requiredCategories.length;

  // Precompute potential scores for all required categories
  const potentialScores = useMemo(() => {
    const map: Record<string, number | null> = {};
    for (const category of requiredCategories) {
      const isCompleted = category in completedCategories;

      if (!canScore || isCompleted) {
        map[category] = null;
        continue;
      }

      const { fn, isColorBased } = getScoreFunction(category, isRainbow);
      if (!fn) {
        map[category] = null;
        continue;
      }

      const score = isColorBased
        ? (fn as (colors: DiceColor[]) => number)(currentColors)
        : (fn as (dice: number[]) => number)(currentDice);

      map[category] = score;
    }
    return map;
  }, [
    requiredCategories,
    completedCategories,
    canScore,
    isRainbow,
    currentDice,
    currentColors,
  ]);

  // On final roll: if *no* remaining category can satisfy the objective, auto-lose.
  useEffect(() => {
    if (!canScore || !onOnlyZeroAvailable || !isFinalRoll) return;

    const available = requiredCategories.filter(
      (category) => !(category in completedCategories)
    );
    if (available.length === 0) return;

    const minValue =
      objectiveType === 'category_minimum' &&
      typeof objectiveValue === 'number'
        ? objectiveValue
        : null;

    let canStillSatisfy = false;

    for (const category of available) {
      const score = potentialScores[category];
      if (typeof score !== 'number') continue;

      if (objectiveType === 'category_minimum') {
        // Our puzzles assume category_minimum applies to the first required category
        const targetCategory = requiredCategories[0];
        if (category === targetCategory && minValue !== null) {
          if (score >= minValue) {
            canStillSatisfy = true;
            break;
          }
        } else {
          // Other categories in a category_minimum puzzle don't matter for the condition;
          // they don't "save" the run.
          continue;
        }
      } else {
        // For all other objective types, "satisfy" means you can get a positive score
        if (score > 0) {
          canStillSatisfy = true;
          break;
        }
      }
    }

    if (!canStillSatisfy) {
      onOnlyZeroAvailable();
    }
  }, [
    canScore,
    isFinalRoll,
    requiredCategories,
    completedCategories,
    potentialScores,
    onOnlyZeroAvailable,
    objectiveType,
    objectiveValue,
  ]);

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold">Objectives</h2>
          </div>
          <div className="text-sm text-gray-400">
            {completedCount} / {totalRequired} complete
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-2 px-4 bg-gray-100 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase">
        <span>Category</span>
        <span className="text-right min-w-[3rem]">Preview</span>
        <span className="text-right min-w-[3rem]">Score</span>
      </div>

      {/* Required Categories */}
      <div>
        {requiredCategories.map((category) => {
          const info = CATEGORY_INFO[category] || { label: category };
          const isCompleted = category in completedCategories;
          const potentialScore = potentialScores[category];
          const actualScore = completedCategories[category];
          const canSelect =
            !isCompleted && canScore && potentialScore !== null;

          return (
            <button
              key={category}
              onClick={() => {
                if (canSelect && potentialScore !== null) {
                  onScoreSelect(category, potentialScore);
                }
              }}
              disabled={!canSelect}
              className={cn(
                'w-full grid grid-cols-[1fr_auto_auto] gap-3 items-center py-4 px-4 border-b border-border last:border-0 transition-all duration-150',
                canSelect &&
                  potentialScore !== null &&
                  potentialScore > 0 &&
                  'hover:bg-gray-100 cursor-pointer',
                canSelect &&
                  potentialScore === 0 &&
                  'hover:bg-gray-50 cursor-pointer opacity-60',
                isCompleted && 'bg-green-50',
                !canSelect && !isCompleted && 'cursor-not-allowed opacity-40'
              )}
            >
              {/* Category Name */}
              <span className="text-left text-base font-medium text-foreground flex items-center gap-2">
                {isCompleted ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                {info.color && (
                  <span
                    className={cn(
                      'w-3 h-3 rounded-full border border-gray-300',
                      info.color === 'red' && 'bg-dice-red',
                      info.color === 'blue' && 'bg-dice-blue',
                      info.color === 'green' && 'bg-dice-green',
                      info.color === 'yellow' && 'bg-dice-yellow',
                      info.color === 'purple' && 'bg-dice-purple'
                    )}
                  />
                )}
                {info.label}
              </span>

              {/* Preview Score */}
              <span
                className={cn(
                  'text-base font-semibold text-right min-w-[3rem]',
                  canSelect &&
                    potentialScore !== null &&
                    potentialScore > 0
                    ? 'text-gray-900'
                    : 'text-gray-400'
                )}
              >
                {canSelect && potentialScore !== null ? potentialScore : '—'}
              </span>

              {/* Final Score */}
              <span
                className={cn(
                  'text-base font-bold text-right min-w-[3rem]',
                  isCompleted ? 'text-green-700' : 'text-gray-300'
                )}
              >
                {isCompleted ? actualScore : '—'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Total */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">TOTAL SCORE</span>
          <span className="text-3xl font-bold">{totalScore}</span>
        </div>
      </div>
    </Card>
  );
};
