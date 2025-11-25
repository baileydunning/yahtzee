import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { DiceRoller } from '@/components/DiceRoller';
import { InteractiveClassicScorecard } from '@/components/InteractiveClassicScorecard';
import { InteractiveRainbowScorecard } from '@/components/InteractiveRainbowScorecard';
import { gameService } from '@/services/gameService';
import { classicScoringEngine } from '@/services/scoringEngine';
import { rainbowScoringEngine, RAINBOW_COLORS } from '@/services/rainbowScoringEngine';
import { GameState, ClassicScores, RainbowScores, HighScore, DiceColor } from '@/types/game';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { achievementService } from '@/services/achievementService';
import { achievementEngine } from '@/services/achievementEngine';
import { AchievementUnlockToast } from '@/components/AchievementUnlockToast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Game = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    const currentGame = gameService.getCurrentGame();
    if (!currentGame) {
      navigate('/');
    } else {
      setGameState(currentGame);
    }
  }, [navigate]);

  if (!gameState) return null;

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const { turnState } = gameState;

  const rollDice = () => {
    if (turnState.rollsLeft === 0 || isRolling) return;

    setIsRolling(true);

    // Roll animation duration
    setTimeout(() => {
      const newDice = turnState.currentDice.map((die, index) => {
        if (turnState.heldDice[index] && turnState.rollsLeft < 3) {
          return die; // Keep held dice values
        }
        return Math.floor(Math.random() * 6) + 1;
      });

      const newColors = turnState.currentColors.map((color, index) => {
        // Keep color for held dice
        if (turnState.heldDice[index] && turnState.rollsLeft < 3) {
          return color;
        }
        // Generate new color for rolled dice
        if (gameState.mode === 'rainbow') {
          return RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
        }
        return 'neutral' as const;
      });

      const updatedState: GameState = {
        ...gameState,
        turnState: {
          ...turnState,
          currentDice: newDice,
          currentColors: newColors,
          rollsLeft: turnState.rollsLeft - 1,
          hasRolled: true,
        },
      };

      setGameState(updatedState);
      gameService.saveCurrentGame(updatedState);
      setIsRolling(false);
    }, 400);
  };

  const toggleHold = (index: number) => {
    if (turnState.rollsLeft === 3 || !turnState.hasRolled) return;

    const newHeldDice = [...turnState.heldDice];
    newHeldDice[index] = !newHeldDice[index];

    const updatedState: GameState = {
      ...gameState,
      turnState: {
        ...turnState,
        heldDice: newHeldDice,
      },
    };

    setGameState(updatedState);
    gameService.saveCurrentGame(updatedState);
  };

  const handleScoreSelect = (category: keyof (ClassicScores | RainbowScores), value: number) => {
    if (!turnState.hasRolled) return;

    const updatedPlayers = [...gameState.players];
    const player = updatedPlayers[gameState.currentPlayerIndex];

    // Enforce correct Yahtzee rules:
    // - First Yahtzee must be scored in Yahtzee box
    // - If Yahtzee box is zeroed, no further Yahtzee bonuses or Joker scoring allowed
    // - If Yahtzee box is filled with 50, subsequent Yahtzees give bonus and cannot be scored in any other box
    const isYahtzeeRoll = turnState.currentDice.every(die => die === turnState.currentDice[0]);
    let blockScoring = false;
    let bonusYahtzeeTurnEnd = false;

    if (isYahtzeeRoll) {
      if (gameState.mode === 'classic') {
        if (player.classicScores.yahtzee === 0) {
          toast({
            title: 'No more Yahtzee bonuses!',
            description: 'You zeroed out the Yahtzee box. No further Yahtzee bonuses or Joker scoring allowed.',
            variant: 'destructive',
          });
          blockScoring = true;
        } else if (player.classicScores.yahtzee === 50 && category !== 'yahtzee') {
          // Bonus Yahtzee: award points and end turn immediately
          player.classicScores.bonusYahtzees = (player.classicScores.bonusYahtzees || 0) + 1;
          toast({
            title: 'Bonus Yahtzee! 🎉',
            description: '+100 points!',
          });
          bonusYahtzeeTurnEnd = true;
        } else if (category !== 'yahtzee' && player.classicScores.yahtzee == null) {
          toast({
            title: 'Yahtzee must be scored in Yahtzee box first!',
            description: 'Score your first Yahtzee in the Yahtzee box.',
            variant: 'destructive',
          });
          blockScoring = true;
        }
      }
      if (gameState.mode === 'rainbow') {
        if (player.rainbowScores.yahtzee === 0) {
          toast({
            title: 'No more Yahtzee bonuses!',
            description: 'You zeroed out the Yahtzee box. No further Yahtzee bonuses or Joker scoring allowed.',
            variant: 'destructive',
          });
          blockScoring = true;
        } else if (player.rainbowScores.yahtzee === 50 && category !== 'yahtzee') {
          player.rainbowScores.bonusYahtzees = (player.rainbowScores.bonusYahtzees || 0) + 1;
          toast({
            title: 'Bonus Yahtzee! 🎉',
            description: '+100 points!',
          });
          bonusYahtzeeTurnEnd = true;
        } else if (category !== 'yahtzee' && player.rainbowScores.yahtzee == null) {
          toast({
            title: 'Yahtzee must be scored in Yahtzee box first!',
            description: 'Score your first Yahtzee in the Yahtzee box.',
            variant: 'destructive',
          });
          blockScoring = true;
        }
      }
    }

    if (blockScoring) return;

    // If bonus Yahtzee, end turn immediately (do not score in any box)
    if (bonusYahtzeeTurnEnd) {
      const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
      const updatedState: GameState = {
        ...gameState,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        turnState: {
          rollsLeft: 3,
          heldDice: [false, false, false, false, false],
          currentDice: [0, 0, 0, 0, 0],
          currentColors: gameState.mode === 'rainbow'
            ? ['red', 'blue', 'green', 'yellow', 'purple']
            : ['neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
          hasRolled: false,
        },
      };
      setGameState(updatedState);
      gameService.saveCurrentGame(updatedState);
      // Check if game is complete
      const isGameComplete = checkGameComplete(updatedState);
      if (isGameComplete) {
        setTimeout(() => setShowFinishDialog(true), 500);
      }
      return;
    }

    if (gameState.mode === 'classic') {
      player.classicScores = {
        ...player.classicScores,
        [category]: value,
      };
    } else {
      player.rainbowScores = {
        ...player.rainbowScores,
        [category]: value,
      };
    }

    // Reset turn state for next player or next turn
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

    const updatedState: GameState = {
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      turnState: {
        rollsLeft: 3,
        heldDice: [false, false, false, false, false],
        currentDice: [0, 0, 0, 0, 0],
        currentColors: gameState.mode === 'rainbow'
          ? ['red', 'blue', 'green', 'yellow', 'purple']
          : ['neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
        hasRolled: false,
      },
    };

    setGameState(updatedState);
    gameService.saveCurrentGame(updatedState);

    // Check if game is complete
    const isGameComplete = checkGameComplete(updatedState);
    if (isGameComplete) {
      setTimeout(() => setShowFinishDialog(true), 500);
    }
  };

  const checkGameComplete = (state: GameState): boolean => {
    return state.players.every(player => {
      if (state.mode === 'classic') {
        const scores = player.classicScores;
        return scores.aces !== null && scores.twos !== null && scores.threes !== null &&
          scores.fours !== null && scores.fives !== null && scores.sixes !== null &&
          scores.threeOfKind !== null && scores.fourOfKind !== null &&
          scores.fullHouse !== null && scores.smallStraight !== null &&
          scores.largeStraight !== null && scores.yahtzee !== null && scores.chance !== null;
      } else {
        const scores = player.rainbowScores;
        return scores.aces !== null && scores.twos !== null && scores.threes !== null &&
          scores.fours !== null && scores.fives !== null && scores.sixes !== null &&
          scores.threeOfKind !== null && scores.fourOfKind !== null &&
          scores.fullHouse !== null && scores.smallStraight !== null &&
          scores.largeStraight !== null && scores.yahtzee !== null && scores.chance !== null &&
          scores.allRed !== null && scores.allBlue !== null && scores.allGreen !== null &&
          scores.allYellow !== null && scores.allPurple !== null &&
          scores.threeColorMix !== null && scores.fourColorMix !== null &&
          scores.rainbowBonus !== null;
      }
    });
  };

  const nextPlayer = () => {
    if (turnState.hasRolled && turnState.rollsLeft < 3) {
      toast({
        title: 'Finish your turn',
        description: 'Please select a category to score',
        variant: 'destructive',
      });
      return;
    }

    const nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    const updatedState: GameState = {
      ...gameState,
      currentPlayerIndex: nextIndex,
      turnState: {
        rollsLeft: 3,
        heldDice: [false, false, false, false, false],
        currentDice: [0, 0, 0, 0, 0],
        currentColors: gameState.mode === 'rainbow'
          ? ['red', 'blue', 'green', 'yellow', 'purple']
          : ['neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
        hasRolled: false,
      },
    };
    setGameState(updatedState);
    gameService.saveCurrentGame(updatedState);
  };

  const prevPlayer = () => {
    if (turnState.hasRolled && turnState.rollsLeft < 3) {
      toast({
        title: 'Finish your turn',
        description: 'Please select a category to score',
        variant: 'destructive',
      });
      return;
    }

    const prevIndex = gameState.currentPlayerIndex === 0
      ? gameState.players.length - 1
      : gameState.currentPlayerIndex - 1;
    const updatedState: GameState = {
      ...gameState,
      currentPlayerIndex: prevIndex,
      turnState: {
        rollsLeft: 3,
        heldDice: [false, false, false, false, false],
        currentDice: [0, 0, 0, 0, 0],
        currentColors: gameState.mode === 'rainbow'
          ? ['red', 'blue', 'green', 'yellow', 'purple']
          : ['neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
        hasRolled: false,
      },
    };
    setGameState(updatedState);
    gameService.saveCurrentGame(updatedState);
  };

  const finishGame = async () => {
    const allUnlockedAchievements: any[] = [];


    await Promise.all(
      gameState.players.map(async (player) => {
        const score = gameState.mode === 'classic'
          ? classicScoringEngine.calculateGrandTotal(player.classicScores)
          : rainbowScoringEngine.calculateTotal(player.rainbowScores);

        const scorecard = {
          id: player.id,
          ...(gameState.mode === 'classic' ? player.classicScores : player.rainbowScores),
        };

        const highScore: HighScore = {
          id: `score-${Date.now()}-${player.id}`,
          mode: gameState.mode,
          score,
          playerNames: [player.name],
          scorecard,
          date: new Date().toISOString(),
        };

        // Save last game score for display on High Scores page
        localStorage.setItem('yahtzee_last_game_score', JSON.stringify(highScore));

        await gameService.saveHighScore(highScore);

        // Update stats and check achievements
        achievementService.updateStatsAfterGame(highScore);
        const unlocked = achievementEngine.checkAchievementsAfterGame(highScore);
        allUnlockedAchievements.push(...unlocked);

        // Update best score in localStorage allTimeStats
        const statsRaw = localStorage.getItem('yahtzee_all_time_stats');
        const stats = statsRaw ? JSON.parse(statsRaw) : {};
        if (gameState.mode === 'classic') {
          if (!stats.bestClassicScore || score > stats.bestClassicScore) {
            stats.bestClassicScore = score;
            localStorage.setItem('yahtzee_all_time_stats', JSON.stringify(stats));
          }
        } else if (gameState.mode === 'rainbow') {
          if (!stats.bestRainbowScore || score > stats.bestRainbowScore) {
            stats.bestRainbowScore = score;
            localStorage.setItem('yahtzee_all_time_stats', JSON.stringify(stats));
          }
        }
      })
    );

    gameService.clearCurrentGame();

    // Show achievement unlock toasts
    if (allUnlockedAchievements.length > 0) {
      let idx = 0;
      for (const achievement of allUnlockedAchievements) {
        setTimeout(() => {
          toast({
            title: undefined,
            description: <AchievementUnlockToast achievement={achievement} />,
            duration: 5000,
          });
        }, idx * 600); // Stagger toasts
        idx++;
      }
    }

    const scoresSummary = gameState.players
      .map((player) => {
        return gameState.mode === 'classic'
          ? classicScoringEngine.calculateGrandTotal(player.classicScores)
          : rainbowScoringEngine.calculateTotal(player.rainbowScores);
      })
      .join(', ');

    let achievementMsg = 'Scores saved to High Scores';
    if (allUnlockedAchievements.length > 0) {
      achievementMsg = `${allUnlockedAchievements.length} achievement` + (allUnlockedAchievements.length > 1 ? 's' : '') + ' unlocked!';
    }

    toast({
      title: `Score: ${scoresSummary} 🎉`,
      description: achievementMsg,
    });

    navigate('/high-scores');
  };

  const canScore = turnState.hasRolled;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto p-4 pt-6">
        {/* Header */}
        <Card className="p-4 mb-6 bg-gray-900 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {gameState.mode === 'classic' ? 'Classic Yahtzee' : 'Rainbow Mode'}
              </h1>
              <p className="text-sm text-gray-400">
                {gameState.players.length} Player{gameState.players.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button
              onClick={() => setShowFinishDialog(true)}
              variant="secondary"
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Finish
            </Button>
          </div>
        </Card>

        {/* Player Navigation */}
        {gameState.players.length > 1 && (
          <div className="flex items-center justify-between mb-6">
            <Button onClick={prevPlayer} variant="outline" size="icon" className="border-gray-300">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Current Player</p>
              <p className="text-lg font-bold text-gray-900">
                {currentPlayer.name}
              </p>
            </div>
            <Button onClick={nextPlayer} variant="outline" size="icon" className="border-gray-300">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Dice Roller */}
        <div className="mb-6">
          <DiceRoller
            mode={gameState.mode}
            dice={turnState.currentDice}
            colors={turnState.currentColors}
            heldDice={turnState.heldDice}
            rollsLeft={turnState.rollsLeft}
            isRolling={isRolling}
            hasRolled={turnState.hasRolled}
            onRoll={rollDice}
            onToggleHold={toggleHold}
          />
        </div>

        {/* Scorecard */}
        {gameState.mode === 'classic' ? (
          <InteractiveClassicScorecard
            scores={currentPlayer.classicScores}
            currentDice={turnState.currentDice}
            canScore={canScore}
            onScoreSelect={handleScoreSelect}
            playerName={currentPlayer.name}
          />
        ) : (
          <InteractiveRainbowScorecard
            scores={currentPlayer.rainbowScores}
            currentDice={turnState.currentDice}
            currentColors={turnState.currentColors.filter((c): c is DiceColor => c !== 'neutral')}
            canScore={canScore}
            onScoreSelect={handleScoreSelect}
            playerName={currentPlayer.name}
          />
        )}
      </div>

      <Navigation />

      {/* Finish Game Dialog */}
      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finish Game?</AlertDialogTitle>
            <AlertDialogDescription>
              This will save all player scores to the High Scores page and end the current game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={finishGame}>Finish &amp; Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Game;
