import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { PuzzleScorecard } from '@/components/PuzzleScorecard';
import { PuzzleResultModal } from '@/components/PuzzleResultModal';
import { Die } from '@/components/Die';
import { PUZZLES } from '@/config/puzzles';
import { puzzleService } from '@/services/puzzleService';
import { RAINBOW_COLORS } from '@/services/rainbowScoringEngine';
import { PuzzleProgress } from '@/types/puzzle';
import { DiceColor } from '@/types/game';
import { ArrowLeft, Lock, RotateCcw, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { achievementEngine } from '@/services/achievementEngine';
import { achievementService } from '@/services/achievementService';
import { AchievementUnlockToast } from '@/components/AchievementUnlockToast';
import { DiceSkinModal } from '@/components/DiceSkinModal';

const MAX_ROLLS_PER_TURN = 3;

const PuzzleGame = () => {
  const navigate = useNavigate();
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const { toast } = useToast();

  const puzzle = useMemo(
    () => PUZZLES.find((p) => p.id === puzzleId),
    [puzzleId]
  );

  const nextPuzzle = useMemo(() => {
    if (!puzzle) return null;
    const currentIndex = PUZZLES.findIndex((p) => p.id === puzzle.id);
    return PUZZLES[currentIndex + 1] || null;
  }, [puzzle]);

  // Dice state
  const [currentDice, setCurrentDice] = useState<number[]>([0, 0, 0, 0, 0]);
  const [currentColors, setCurrentColors] = useState<(DiceColor | 'neutral')[]>(
    ['neutral', 'neutral', 'neutral', 'neutral', 'neutral']
  );
  const [heldDice, setHeldDice] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false
  ]);
  const [rollsThisTurn, setRollsThisTurn] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  // Multi-category tracking
  const [completedCategories, setCompletedCategories] = useState<
    Record<string, number>
  >({});

  // Result state
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState<PuzzleProgress | null>(null);

  // Track turn index so only the first turn uses preset initialDice
  const [turnIndex, setTurnIndex] = useState(0);

  // Puzzle over / loss delay
  const [isPuzzleOver, setIsPuzzleOver] = useState(false);
  const lossTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requiredCategories = useMemo(() => {
    if (!puzzle) return [];
    return (
      puzzle.constraints.requiredCategories ||
      [puzzle.objective.value as string]
    );
  }, [puzzle]);

  const isMultiCategory = requiredCategories.length > 1;

  useEffect(() => {
    if (!puzzle) {
      navigate('/puzzles');
      return;
    }
    resetPuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle, navigate]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (lossTimeoutRef.current) {
        clearTimeout(lossTimeoutRef.current);
      }
    };
  }, []);

  if (!puzzle) return null;

  const isRainbow = puzzle.gameMode === 'rainbow';

  // "Specified start" = initialDice has any non-zero value
  const hasPresetStart = useMemo(
    () => puzzle.initialDice?.some((d) => d !== 0),
    [puzzle]
  );

  /**
   * Sets up a single turn.
   * - If isFirstTurn && hasPresetStart => use puzzle.initialDice as first roll (2 rerolls left)
   * - Otherwise => blank dice, 3 full rolls available
   */
  const setupTurn = (isFirstTurn: boolean) => {
    const locked = puzzle.constraints.lockedDiceIndices || [];
    const initialHeld = [0, 1, 2, 3, 4].map((i) => locked.includes(i));
    setHeldDice(initialHeld);

    if (isFirstTurn && hasPresetStart) {
      // First turn: use preset start as roll #1
      setCurrentDice([...puzzle.initialDice]);
      setCurrentColors(
        isRainbow && puzzle.initialColors
          ? [...puzzle.initialColors]
          : ['neutral', 'neutral', 'neutral', 'neutral', 'neutral']
      );
      setRollsThisTurn(1);
      setHasRolled(true);
    } else {
      // Normal Yahtzee turn: empty board, must roll, 3 rolls available
      setCurrentDice([0, 0, 0, 0, 0]);
      setCurrentColors(['neutral', 'neutral', 'neutral', 'neutral', 'neutral']);
      setRollsThisTurn(0);
      setHasRolled(false);
    }
  };

  const resetPuzzle = () => {
    if (lossTimeoutRef.current) {
      clearTimeout(lossTimeoutRef.current);
      lossTimeoutRef.current = null;
    }
    setTurnIndex(0);
    setupTurn(true); // first turn semantics
    setCompletedCategories({});
    setShowResult(false);
    setFinalScore(0);
    setIsSuccess(false);
    setIsPuzzleOver(false);
  };

  const rollsLeft = MAX_ROLLS_PER_TURN - rollsThisTurn;
  const isFinalRoll = hasRolled && rollsLeft === 0;
  const completedCount = Object.keys(completedCategories).length;
  const allCategoriesComplete = completedCount === requiredCategories.length;

  const rollDice = () => {
    if (rollsLeft === 0 || isRolling || isPuzzleOver) return;

    setIsRolling(true);

    setTimeout(() => {
      const newDice = currentDice.map((die, index) => {
        if (puzzle.constraints.lockedDiceIndices?.includes(index)) {
          return die;
        }
        if (heldDice[index]) return die;
        return Math.floor(Math.random() * 6) + 1;
      });

      const newColors = currentColors.map((color, index) => {
        if (puzzle.constraints.lockedDiceIndices?.includes(index)) {
          return color;
        }
        if (heldDice[index]) return color;
        if (isRainbow) {
          return RAINBOW_COLORS[
            Math.floor(Math.random() * RAINBOW_COLORS.length)
          ];
        }
        return 'neutral' as const;
      });

      setCurrentDice(newDice);
      setCurrentColors(newColors);
      setRollsThisTurn((prev) => prev + 1);
      setHasRolled(true);
      setIsRolling(false);
    }, 400);
  };

  const toggleHold = (index: number) => {
    if (isPuzzleOver) return;

    if (puzzle.constraints.lockedDiceIndices?.includes(index)) {
      toast({
        title: 'Locked Die',
        description: 'This die cannot be rerolled in this puzzle',
        variant: 'destructive'
      });
      return;
    }

    const newHeld = [...heldDice];
    newHeld[index] = !newHeld[index];
    setHeldDice(newHeld);
  };

  const finishPuzzle = (
    success: boolean,
    newCompleted: Record<string, number>
  ) => {
    if (isPuzzleOver) return;
    setIsPuzzleOver(true);

    const totalScore = Object.values(newCompleted).reduce(
      (sum, val) => sum + val,
      0
    );
    const updatedProgress = puzzleService.updateProgress(
      puzzle.id,
      totalScore,
      success
    );

    setProgress(updatedProgress);
    setFinalScore(totalScore);
    setIsSuccess(success);

    // Update puzzle stats for puzzle achievements (allTimeStats)
    achievementService.updateStatsAfterPuzzle({
      puzzleId: puzzle.id,
      mode: puzzle.gameMode,
      success,
      // treat success with all positive required categories as a "perfect" puzzle
      perfect:
        success &&
        requiredCategories.every((cat) => (newCompleted[cat] ?? 0) > 0) &&
        updatedProgress?.attempts === 1
    });

    // 🔐 Puzzle achievements (category: 'puzzle' in ACHIEVEMENTS)
    const unlockedPuzzleAchievements =
      achievementEngine.checkAchievementsAfterPuzzle({
        mode: puzzle.gameMode,
        success,
        attempts: updatedProgress?.attempts ?? 1
      });

    if (unlockedPuzzleAchievements.length > 0) {
      unlockedPuzzleAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          toast({
            title: undefined,
            description: <AchievementUnlockToast achievement={achievement} />,
            duration: 5000
          });
        }, index * 600);
      });
    }

    if (success) {
      setShowResult(true);
    } else {
      lossTimeoutRef.current = setTimeout(() => {
        setShowResult(true);
      }, 2000);
    }
  };

  // Called when it's the final roll and no remaining category can satisfy the objective
  const handleOnlyZeroAvailable = () => {
    if (showResult || isPuzzleOver) return;
    finishPuzzle(false, completedCategories);
  };

  const handleScoreSelect = (category: string, value: number) => {
    if (!hasRolled || isPuzzleOver) return;

    const newCompleted = { ...completedCategories, [category]: value };
    setCompletedCategories(newCompleted);

    const nowCompletedCount = Object.keys(newCompleted).length;
    const allComplete = nowCompletedCount === requiredCategories.length;

    // If they choose zero (or negative) at any time, they lose.
    if (value <= 0) {
      finishPuzzle(false, newCompleted);
      return;
    }

    if (allComplete) {
      let success = true;

      if (puzzle.objective.type === 'category_minimum') {
        const targetCategory = requiredCategories[0];
        const categoryValue = newCompleted[targetCategory] || 0;
        success = categoryValue >= (puzzle.objective.value as number);
      } else if (puzzle.objective.type === 'score_at_least') {
        const totalScore = Object.values(newCompleted).reduce(
          (sum, val) => sum + val,
          0
        );
        success = totalScore >= (puzzle.objective.value as number);
      } else if (puzzle.objective.type === 'score_exactly') {
        const totalScore = Object.values(newCompleted).reduce(
          (sum, val) => sum + val,
          0
        );
        success = totalScore === (puzzle.objective.value as number);
      } else {
        // specific_category, multiple_categories, color_objective:
        // all required categories must be scored > 0
        success = requiredCategories.every(
          (cat) => (newCompleted[cat] || 0) > 0
        );
      }

      finishPuzzle(success, newCompleted);
    } else if (isMultiCategory) {
      // Multi-category & not finished: scored > 0, go to *next turn*.
      setTurnIndex((t) => t + 1);
      setupTurn(false);
    }
  };

  const handleRetry = () => {
    resetPuzzle();
  };

  const handleNextPuzzle = () => {
    if (nextPuzzle) navigate(`/puzzle/${nextPuzzle.id}`);
  };

  const handleBackToList = () => {
    navigate('/puzzles');
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto p-4 pt-6">
        {/* Header */}
        <Card className="p-4 mb-6 bg-gray-900 text-white border-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/puzzles')}
              className="text-white hover:bg-white/10"
              aria-label="Back to puzzles"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate">{puzzle.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <DiceSkinModal
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    aria-label="Change dice skin"
                  >
                    <Palette className="w-5 h-5" />
                  </Button>
                }
              />
              <Button
                onClick={resetPuzzle}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                aria-label="Reset puzzle"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Objective */}
          <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3 mt-4">
            <p className="text-sm flex-1">{puzzle.objective.description}</p>
            {puzzle.constraints.lockedDiceIndices &&
              puzzle.constraints.lockedDiceIndices.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-yellow-400 shrink-0">
                  <Lock className="w-3 h-3" />
                  <span>
                    {puzzle.constraints.lockedDiceIndices.length} locked
                  </span>
                </div>
              )}
          </div>
        </Card>

        {/* Dice Roller */}
        <div className="mb-6">
          <Card className="p-6 bg-white border-2 border-gray-200">
            <div className="flex flex-col items-center gap-6">
              {/* Rolls remaining indicator */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  Rolls This Turn
                </p>
                <div className="flex gap-2 justify-center">
                  {[...Array(MAX_ROLLS_PER_TURN)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-3 h-3 rounded-full transition-colors',
                        i < rollsThisTurn ? 'bg-gray-900' : 'bg-gray-300'
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {rollsLeft} roll{rollsLeft !== 1 ? 's' : ''} left
                </p>
              </div>

              {/* Dice display: 3+2 grid layout for 5 dice */}
              <div className="grid grid-cols-3 gap-4 mb-2 justify-items-center">
                {/* Top row: dice 0, 1, 2 */}
                {[0, 1, 2].map((index) => {
                  const isLocked = puzzle.constraints.lockedDiceIndices?.includes(index);
                  return (
                    <div key={index} className="relative">
                      <DieWithLock
                        value={currentDice[index]}
                        color={currentColors[index]}
                        isHeld={heldDice[index]}
                        isLocked={isLocked}
                        isRolling={isRolling}
                        onToggleHold={() => toggleHold(index)}
                        disabled={isRolling || isPuzzleOver}
                      />
                    </div>
                  );
                })}
                {/* Bottom row: dice 3 and 4, centered under grid */}
                <div className="col-span-3 flex justify-center gap-4">
                  {[3, 4].map((index) => {
                    const isLocked = puzzle.constraints.lockedDiceIndices?.includes(index);
                    return (
                      <div key={index} className="relative">
                        <DieWithLock
                          value={currentDice[index]}
                          color={currentColors[index]}
                          isHeld={heldDice[index]}
                          isLocked={isLocked}
                          isRolling={isRolling}
                          onToggleHold={() => toggleHold(index)}
                          disabled={isRolling || isPuzzleOver}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Roll button */}
              <Button
                onClick={rollDice}
                disabled={rollsLeft === 0 || isRolling || isPuzzleOver}
                size="lg"
                className="w-full max-w-xs h-14 text-lg bg-gray-900 hover:bg-gray-800 text-white"
              >
                {rollsLeft === 0 ? 'No Rolls Left' : `Roll (${rollsLeft} left)`}
              </Button>

              {hasRolled && rollsLeft > 0 && !isPuzzleOver && (
                <p className="text-sm text-gray-600 text-center font-medium">
                  Tap dice to hold, then roll again
                </p>
              )}

              {(rollsLeft === 0 || hasRolled) &&
                !allCategoriesComplete &&
                !isPuzzleOver && (
                  <p className="text-sm font-semibold text-gray-900 text-center">
                    Select a category below to{' '}
                    {isMultiCategory ? 'score' : 'complete the puzzle'}
                  </p>
                )}
            </div>
          </Card>
        </div>

        {/* Puzzle Scorecard - Only shows required categories */}
        <PuzzleScorecard
          requiredCategories={requiredCategories}
          completedCategories={completedCategories}
          currentDice={currentDice}
          currentColors={currentColors.filter(
            (c): c is DiceColor => c !== 'neutral'
          )}
          canScore={hasRolled && !allCategoriesComplete && !isPuzzleOver}
          onScoreSelect={handleScoreSelect}
          isRainbow={isRainbow}
          isFinalRoll={isFinalRoll}
          onOnlyZeroAvailable={handleOnlyZeroAvailable}
          objectiveType={puzzle.objective.type}
          objectiveValue={puzzle.objective.value}
        />
      </div>

      {/* Result Modal */}
      <PuzzleResultModal
        open={showResult}
        puzzle={puzzle}
        score={finalScore}
        success={isSuccess}
        progress={progress}
        onRetry={handleRetry}
        onNextPuzzle={handleNextPuzzle}
        onBackToList={handleBackToList}
        hasNextPuzzle={!!nextPuzzle}
      />

      <Navigation />
    </div>
  );
};

// Die component with lock indicator
const DieWithLock = ({
  value,
  color,
  isHeld,
  isLocked,
  isRolling,
  onToggleHold,
  disabled
}: {
  value: number;
  color: DiceColor | 'neutral';
  isHeld: boolean;
  isLocked?: boolean;
  isRolling: boolean;
  onToggleHold: () => void;
  disabled: boolean;
}) => {
  return (
    <div className="relative">
      <Die
        value={value}
        color={color}
        isHeld={isHeld || !!isLocked}
        isRolling={isRolling}
        onToggleHold={onToggleHold}
        disabled={disabled || !!isLocked}
      />
      {isLocked && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
          <Lock className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

export default PuzzleGame;
