import { ACHIEVEMENTS } from '@/config/achievements';
import { achievementService } from './achievementService';
import { Achievement, AchievementContext } from '@/types/achievements';
import { GameMode, HighScore } from '@/types/game';

export const achievementEngine = {
  // --------------------------------------------------
  // Check achievements after a normal game completes
  // --------------------------------------------------
  checkAchievementsAfterGame(highScore: HighScore): Achievement[] {
    const allTimeStats = achievementService.getAllTimeStats();
    const progress = achievementService.getAchievementProgress();
    const newlyUnlocked: Achievement[] = [];

    const unlockedAchievementIds = Object.entries(progress)
      .filter(([_, p]) => p.unlocked)
      .map(([id]) => id);

    const context: AchievementContext = {
      mode: highScore.mode,
      // Map scorecard into the mode-specific field expected by ACHIEVEMENTS
      classicScores:
        highScore.mode === 'classic' ? (highScore.scorecard as any) : null,
      rainbowScores:
        highScore.mode === 'rainbow' ? (highScore.scorecard as any) : null,
      allTimeStats,
      unlockedAchievementIds,
      // puzzle-specific fields not relevant here
      puzzleSuccess: undefined,
      puzzleAttempts: undefined,
    };

    // Check all achievements that care about normal games
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (progress[achievement.id]?.unlocked) continue;

      // Skip puzzle-only achievements here (handled in checkAchievementsAfterPuzzle)
      if (achievement.category === 'puzzle') continue;

      // Skip if wrong mode (unless dual mode achievement)
      if (
        achievement.category !== 'dual' &&
        !achievement.modes.includes(highScore.mode)
      ) {
        continue;
      }

      const result = achievement.checkCondition(context);

      // Boolean style (immediate unlock)
      if (typeof result === 'boolean' && result) {
        achievementService.unlockAchievement(achievement.id);
        newlyUnlocked.push(achievement);
      }
      // Numeric style (stat-based / incremental)
      else if (typeof result === 'number' && achievement.target) {
        achievementService.updateProgress(achievement.id, result);

        if (result >= achievement.target) {
          achievementService.unlockAchievement(achievement.id);
          newlyUnlocked.push(achievement);
        }
      }
    }

    // Re-fetch progress AFTER unlocking some achievements so
    // master-of-modes style stuff can see the updated state.
    const updatedProgress = achievementService.getAchievementProgress();
    this.checkMasterOfModes(updatedProgress, newlyUnlocked);

    return newlyUnlocked;
  },

  // --------------------------------------------------
  // Check achievements after a puzzle completes
  // (for achievements with category: 'puzzle')
  // --------------------------------------------------
  checkAchievementsAfterPuzzle(args: {
    mode: GameMode;
    success: boolean;
    attempts: number;
  }): Achievement[] {
    // ❗ Only award puzzle achievements on success
    if (!args.success) {
      return [];
    }

    const allTimeStats = achievementService.getAllTimeStats();
    const progress = achievementService.getAchievementProgress();
    const newlyUnlocked: Achievement[] = [];

    const unlockedAchievementIds = Object.entries(progress)
      .filter(([_, p]) => p.unlocked)
      .map(([id]) => id);

    const context: AchievementContext = {
      mode: args.mode,
      classicScores: null,
      rainbowScores: null,
      allTimeStats,
      unlockedAchievementIds,
      puzzleSuccess: args.success,
      puzzleAttempts: args.attempts,
    };

    // Only consider puzzle achievements here so we don't double-trigger game ones
    for (const achievement of ACHIEVEMENTS) {
      if (achievement.category !== 'puzzle') continue;
      if (progress[achievement.id]?.unlocked) continue;

      // Mode filter if puzzle achievements are mode-specific
      if (!achievement.modes.includes(args.mode)) {
        continue;
      }

      const result = achievement.checkCondition(context);

      if (typeof result === 'boolean' && result) {
        achievementService.unlockAchievement(achievement.id);
        newlyUnlocked.push(achievement);
      } else if (typeof result === 'number' && achievement.target) {
        achievementService.updateProgress(achievement.id, result);

        if (result >= achievement.target) {
          achievementService.unlockAchievement(achievement.id);
          newlyUnlocked.push(achievement);
        }
      }
    }

    // Puzzle achievements don't affect Master of Modes (which looks at classic/rainbow),
    // so we don't need to call checkMasterOfModes here.

    return newlyUnlocked;
  },

  // --------------------------------------------------
  // Special logic for Master of Modes achievement
  // --------------------------------------------------
  checkMasterOfModes(
    progress: Record<string, { unlocked?: boolean; progress?: number }>,
    newlyUnlocked: Achievement[]
  ): void {
    const masterAchievement = ACHIEVEMENTS.find(
      (a) => a.id === 'master-modes'
    );
    if (!masterAchievement) return;

    // Count unlocked achievements per mode (based on category)
    const classicUnlocked = ACHIEVEMENTS.filter(
      (a) => a.category === 'classic' && progress[a.id]?.unlocked
    ).length;

    const rainbowUnlocked = ACHIEVEMENTS.filter(
      (a) => a.category === 'rainbow' && progress[a.id]?.unlocked
    ).length;

    // Progress for progress bar (for example: max 6, 3 from each category)
    const totalProgress =
      Math.min(classicUnlocked, 3) + Math.min(rainbowUnlocked, 3);
    achievementService.updateProgress('master-modes', totalProgress);

    // Unlock if both sides have at least 3 achievements
    if (
      !progress['master-modes']?.unlocked &&
      classicUnlocked >= 3 &&
      rainbowUnlocked >= 3
    ) {
      achievementService.unlockAchievement('master-modes');
      newlyUnlocked.push(masterAchievement);
    }
  },

  // --------------------------------------------------
  // Helper: get all achievements merged with saved progress
  // --------------------------------------------------
  getAllAchievementsWithProgress() {
    const progress = achievementService.getAchievementProgress();

    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      progress: progress[achievement.id] || {
        id: achievement.id,
        unlocked: false,
        progress: 0,
        // unlockedAt stays undefined until actually unlocked
      },
    }));
  },
};
