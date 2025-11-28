import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { gameService } from '@/services/gameService';
import { Player, GameState } from '@/types/game';
import { Dices, Plus, Trash2 } from 'lucide-react';

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
        currentColors: mode === 'rainbow' 
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
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Dices className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Yahtzee</h1>
          </div>
          <p className="text-muted-foreground text-lg">Classic, Rainbow & Puzzle Modes</p>
        </div>

        {hasExistingGame && (
          <Card className="p-6 mb-6 bg-accent border-primary/20">
            <h2 className="text-xl font-semibold mb-3 text-foreground">Continue Your Game</h2>
            <p className="text-muted-foreground mb-4">You have a game in progress</p>
            <div className="flex gap-3">
              <Button onClick={resumeGame} className="flex-1" size="lg">
                Resume Game
              </Button>
              <Button 
                onClick={() => setHasExistingGame(false)} 
                variant="outline"
                size="lg"
              >
                Start New
              </Button>
            </div>
          </Card>
        )}

        {!hasExistingGame && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">New Game</h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Game Mode</Label>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as SelectableMode)}>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="classic" id="classic" />
                    <Label htmlFor="classic" className="flex-1 cursor-pointer">
                      <div className="font-medium">Classic Mode</div>
                      <div className="text-sm text-muted-foreground">The game that started it all</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="rainbow" id="rainbow" />
                    <Label htmlFor="rainbow" className="flex-1 cursor-pointer">
                      <div className="font-medium">Rainbow Mode</div>
                      <div className="text-sm text-muted-foreground">Unleash the power of colorful dice</div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="puzzle" id="puzzle" />
                    <Label htmlFor="puzzle" className="flex-1 cursor-pointer">
                      <div className="font-medium flex items-center gap-2">
                        Puzzle Mode
                      </div>
                      <div className="text-sm text-muted-foreground">Tackle unique objectives and test your skills</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Only show player selection for non-puzzle modes */}
              {!isPuzzleMode && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">Players</Label>
                    {playerNames.length < 4 && (
                      <Button onClick={addPlayer} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Player
                      </Button>
                    )}
                  </div>
                  {nameError && (
                    <div className="text-sm text-red-600 mb-2">{nameError}</div>
                  )}
                  <div className="space-y-3">
                    {playerNames.map((name, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={name}
                          onChange={(e) => updatePlayerName(index, e.target.value)}
                          placeholder={`Player ${index + 1}`}
                          className="text-base h-12"
                          required
                        />
                        {playerNames.length > 1 && (
                          <Button
                            onClick={() => removePlayer(index)}
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={startNewGame} size="lg" className="w-full text-base h-12">
                {isPuzzleMode ? 'Browse Puzzles' : 'Start Game'}
              </Button>
            </div>
          </Card>
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default Index;
