import { Die } from '@/components/Die';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DiceColor, GameMode } from '@/types/game';
import { Dices } from 'lucide-react';
import { RAINBOW_COLORS } from '@/services/rainbowScoringEngine';

interface DiceRollerProps {
  mode: GameMode;
  dice: number[];
  colors: (DiceColor | 'neutral')[];
  heldDice: boolean[];
  rollsLeft: number;
  isRolling: boolean;
  hasRolled: boolean;
  onRoll: () => void;
  onToggleHold: (index: number) => void;
}

export const DiceRoller = ({
  mode,
  dice,
  colors,
  heldDice,
  rollsLeft,
  isRolling,
  hasRolled,
  onRoll,
  onToggleHold,
}: DiceRollerProps) => {
  return (
    <Card className="p-6 bg-white border-2 border-gray-200">
      <div className="flex flex-col items-center gap-6">
        {/* Rolls remaining indicator */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2 font-medium">Rolls Remaining</p>
          <div className="flex gap-2 justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors',
                  i < rollsLeft ? 'bg-gray-900' : 'bg-gray-300'
                )}
              />
            ))}
          </div>
        </div>

        {/* Dice display */}
        <div className="grid grid-cols-3 gap-4 mb-2 justify-items-center sm:flex sm:flex-wrap sm:justify-center">
          {/* Top 3 dice auto-place in columns 1, 2, 3 */}
          {/* Bottom 2 dice go inside a full-width flex container */}

          {dice.map((value, index) => {
            // For bottom row, wrap dice 3 and 4 in a flex row that spans all columns
            if (index === 3) {
              return (
                <div key="bottom-row" className="col-span-3 flex justify-center gap-4">
                  {/* bottom die #1 */}
                  <Die
                    value={dice[3]}
                    color={colors[3]}
                    isHeld={heldDice[3]}
                    isRolling={isRolling}
                    onToggleHold={() => onToggleHold(3)}
                    disabled={rollsLeft === 3 || isRolling}
                  />

                  {/* bottom die #2 */}
                  {dice[4] !== undefined && (
                    <Die
                      value={dice[4]}
                      color={colors[4]}
                      isHeld={heldDice[4]}
                      isRolling={isRolling}
                      onToggleHold={() => onToggleHold(4)}
                      disabled={rollsLeft === 3 || isRolling}
                    />
                  )}
                </div>
              );
            }

            // Skip die #4 here so it’s only rendered inside the row above
            if (index === 4) return null;

            return (
              <Die
                key={index}
                value={value}
                color={colors[index]}
                isHeld={heldDice[index]}
                isRolling={isRolling}
                onToggleHold={() => onToggleHold(index)}
                disabled={rollsLeft === 3 || isRolling}
              />
            );
          })}
        </div>



        {/* Roll button */}
        <Button
          onClick={onRoll}
          disabled={rollsLeft === 0 || isRolling}
          size="lg"
          className="w-full max-w-xs h-14 text-lg bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Dices className="w-5 h-5 mr-2" />
          {rollsLeft === 3 ? 'Start Roll' : rollsLeft === 0 ? 'No Rolls Left' : `Roll (${rollsLeft} left)`}
        </Button>

        {hasRolled && rollsLeft > 0 && (
          <p className="text-sm text-gray-600 text-center font-medium">
            Tap dice to hold, then roll again
          </p>
        )}

        {rollsLeft === 0 && (
          <p className="text-sm font-semibold text-gray-900 text-center">
            Select a category below to score
          </p>
        )}
      </div>
    </Card>
  );
};

// Helper function for className
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
