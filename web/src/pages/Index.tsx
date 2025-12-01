import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { gameService } from '@/services/gameService';
import { Player, GameState } from '@/types/game';
import { Dices, Plus, Trash2, Info } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type SelectableMode = 'classic' | 'rainbow' | 'puzzle';

const Index = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SelectableMode>('classic');
  const [playerNames, setPlayerNames] = useState<string[]>(['']);
  const [hasExistingGame, setHasExistingGame] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    const settings = gameService.getSettings();
    if (settings.defaultMode !== 'puzzle') {
      setMode(settings.defaultMode);
    }

    const currentGame = gameService.getCurrentGame();
    setHasExistingGame(!!currentGame);
  }, []);

  const addPlayer = () => {
    if (playerNames.length < 4) {
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  const startNewGame = () => {
    // If puzzle mode, navigate to puzzle list
    if (mode === 'puzzle') {
      navigate('/puzzles');
      return;
    }

    // Validate player names
    const invalidName = playerNames.some((name) => !name.trim());
    if (invalidName) {
      setNameError('Please enter a name for each player.');
      return;
    }
    setNameError(null);

    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${Date.now()}-${index}`,
      name: name.trim(),
      classicScores: {
        aces: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfKind: null,
        fourOfKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        bonusYahtzees: 0,
      },
      rainbowScores: {
        aces: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfKind: null,
        fourOfKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        allRed: null,
        allBlue: null,
        allGreen: null,
        allYellow: null,
        allPurple: null,
        threeColorMix: null,
        fourColorMix: null,
        rainbowBonus: null,
        bonusYahtzees: 0,
      },
    }));

    const newGame: GameState = {
      id: `game-${Date.now()}`,
      mode,
      players,
      currentPlayerIndex: 0,
      turnState: {
        rollsLeft: 3,
        heldDice: [false, false, false, false, false],
        currentDice: [0, 0, 0, 0, 0],
        currentColors:
          mode === 'rainbow'
            ? ['red', 'blue', 'green', 'yellow', 'purple']
            : ['neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
        hasRolled: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    gameService.saveCurrentGame(newGame);
    navigate('/game');
  };

  const resumeGame = () => {
    navigate('/game');
  };

  const isPuzzleMode = mode === 'puzzle';

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-8">
      <div className="max-w-2xl mx-auto px-3 pt-6 pb-4 sm:px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-1.5 sm:mb-2">
            <Dices className="w-9 h-9 sm:w-10 sm:h-10 text-primary" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Yahtzee
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">
            Classic, Rainbow &amp; Puzzle Modes
          </p>
        </div>

        {hasExistingGame && (
          <Card className="p-4 sm:p-6 mb-5 sm:mb-6 bg-accent border-primary/20">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
              Continue Your Game
            </h2>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              You have a game in progress
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button onClick={resumeGame} className="w-full sm:flex-1" size="lg">
                Resume Game
              </Button>
              <Button
                onClick={() => setHasExistingGame(false)}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Start New
              </Button>
            </div>
          </Card>
        )}

        {!hasExistingGame && (
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">
              New Game
            </h2>

            <div className="space-y-5 sm:space-y-6">
              <div>
                <Label className="text-base font-medium mb-2.5 sm:mb-3 block">
                  Game Mode
                </Label>
                <RadioGroup
                  value={mode}
                  onValueChange={(v) => setMode(v as SelectableMode)}
                  className="space-y-3"
                >
                  {/* Classic */}
                  <div className="flex items-start sm:items-center gap-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="classic" id="classic" className="mt-1 sm:mt-0" />
                    <div className="flex-1 flex items-start justify-between gap-2">
                      <Label
                        htmlFor="classic"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm sm:text-base">
                          Classic Mode
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Where strategy meets luck
                        </div>
                      </Label>
                      <ModeInfoDialog
                        title="How to play Classic Mode"
                        ariaLabel="Classic mode instructions"
                      >
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
                          <li>Roll five dice. You may reroll any or all dice up to 3 times per turn to get your best combination.</li>
                          <li>After your final roll, choose one scoring category to fill in—each category can only be used once per game.</li>
                          <li>Try to maximize your score in each category: some reward matching numbers, others reward sequences or special combos.</li>
                          <li>Fill every box in both the upper and lower sections to complete the game. Plan ahead—once a category is used, it’s gone!</li>
                          <li>Score a Yahtzee (five dice showing the same number) for 50 points. Get more Yahtzees for big bonus points!</li>
                          <li>The player with the highest total score at the end wins. Good luck and strategize your rolls!</li>
                        </ul>
                      </ModeInfoDialog>
                    </div>
                  </div>

                  {/* Rainbow */}
                  <div className="flex items-start sm:items-center gap-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="rainbow" id="rainbow" className="mt-1 sm:mt-0" />
                    <div className="flex-1 flex items-start justify-between gap-2">
                      <Label
                        htmlFor="rainbow"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm sm:text-base">
                          Rainbow Mode
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Score more with colorful dice
                        </div>
                      </Label>
                      <ModeInfoDialog
                        title="How to play Rainbow Mode"
                        ariaLabel="Rainbow mode instructions"
                      >
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
                          <li>Play with five dice, each showing both a number and a vibrant color—red, blue, green, yellow, or purple.</li>
                          <li>Roll up to 3 times per turn, holding any dice you want between rolls to build the best combination of numbers and colors.</li>
                          <li>After your final roll, choose one category to score. In Rainbow Mode, you can score classic combos <b>and</b> special color categories like All Red, All Blue, All Green, All Yellow, All Purple, Three-Color Mix, Four-Color Mix, and Rainbow Bonus.</li>
                          <li>To score a color category, match the required colors exactly—e.g., all dice showing red for All Red, or all five colors for Rainbow Bonus.</li>
                          <li>Strategize to chase huge combos: combine high numbers with color matches for maximum points. Every turn is a puzzle of color and value!</li>
                          <li>Fill every box to finish the game. The player with the highest total—across numbers and colors—wins!</li>
                        </ul>
                      </ModeInfoDialog>
                    </div>
                  </div>

                  {/* Puzzle */}
                  <div className="flex items-start sm:items-center gap-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="puzzle" id="puzzle" className="mt-1 sm:mt-0" />
                    <div className="flex-1 flex items-start justify-between gap-2">
                      <Label
                        htmlFor="puzzle"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium flex items-center gap-2 text-sm sm:text-base">
                          Puzzle Mode
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Tackle unique objectives and test your luck
                        </div>
                      </Label>
                      <ModeInfoDialog
                        title="How to play Puzzle Mode"
                        ariaLabel="Puzzle mode instructions"
                      >
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
                          <li>Browse a collection of handcrafted puzzles, each designed to test your Yahtzee skills in new ways.</li>
                          <li>Every puzzle presents a unique challenge—your objective might be to reach a target score, fill specific categories, or achieve special color combos.</li>
                          <li>You have three rolls per turn. Plan carefully and adapt your strategy to the puzzle’s constraints.</li>
                          <li>To win, you must satisfy the puzzle’s objective without scoring zero in any required category. One mistake and the puzzle is lost!</li>
                          <li>Track your progress, replay puzzles for a better score, and aim for perfect solves on your first attempt!</li>
                        </ul>
                      </ModeInfoDialog>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Only show player selection for non-puzzle modes */}
              {!isPuzzleMode && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5 sm:mb-3">
                    <Label className="text-base font-medium">Players</Label>
                    {playerNames.length < 4 && (
                      <Button
                        onClick={addPlayer}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Player
                      </Button>
                    )}
                  </div>
                  {nameError && (
                    <div className="text-sm text-red-600 mb-2">
                      {nameError}
                    </div>
                  )}
                  <div className="space-y-2.5 sm:space-y-3">
                    {playerNames.map((name, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row gap-2"
                      >
                        <Input
                          value={name}
                          onChange={(e) =>
                            updatePlayerName(index, e.target.value)
                          }
                          placeholder={`Player ${index + 1}`}
                          className="text-base h-11 sm:h-12"
                          required
                        />
                        {playerNames.length > 1 && (
                          <Button
                            onClick={() => removePlayer(index)}
                            variant="outline"
                            size="icon"
                            className="h-11 w-full sm:w-12 sm:h-12 shrink-0"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-1">
                <Button
                  onClick={startNewGame}
                  size="lg"
                  className="w-full text-base h-12"
                >
                  {isPuzzleMode ? 'Browse Puzzles' : 'Start Game'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Navigation />
    </div>
  );
};

type ModeInfoDialogProps = {
  title: string;
  ariaLabel: string;
  children: ReactNode;
};

const ModeInfoDialog = ({ title, ariaLabel, children }: ModeInfoDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label={ariaLabel}
        >
          <Info className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md w-[92vw] sm:w-full mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base sm:text-lg">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
              {children}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto">
            Close
          </AlertDialogCancel>
          <AlertDialogAction className="w-full sm:w-auto">
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Index;
