import { ACHIEVEMENTS } from '@/config/achievements';
import { achievementService } from './achievementService';
import { Achievement, AchievementContext } from '@/types/achievements';
import { HighScore } from '@/types/game';

export const achievementEngine = {
  // Check achievements after a game completes
  checkAchievementsAfterGame(highScore: HighScore): Achievement[] {
    const allTimeStats = achievementService.getAllTimeStats();
    const progress = achievementService.getAchievementProgress();
    const newlyUnlocked: Achievement[] = [];

    const context: AchievementContext = {
      mode: highScore.mode,
      // Map scorecard into the mode-specific field expected by ACHIEVEMENTS
      classicScores:
        highScore.mode === 'classic' ? (highScore.scorecard as any) : null,
      rainbowScores:
        highScore.mode === 'rainbow' ? (highScore.scorecard as any) : null,
      allTimeStats,
    };

    // Check all achievements
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (progress[achievement.id]?.unlocked) continue;

      // Skip if wrong mode (unless dual mode achievement)
      if (
        achievement.category !== 'dual' &&
        !achievement.modes.includes(highScore.mode)
      ) {
        continue;
      }

      // Check condition
      const result = achievement.checkCondition(context);

      // Most of your checkCondition functions return boolean,
      // but we keep optional number handling for incremental-style achievements.
      if (typeof result === 'boolean' && result) {
        // Unlock achievement
        achievementService.unlockAchievement(achievement.id);
        newlyUnlocked.push(achievement);
      } else if (typeof result === 'number' && achievement.target) {
        // Update progress for incremental achievements (based on absolute stat)
        achievementService.updateProgress(achievement.id, result);

        if (result >= achievement.target) {
          achievementService.unlockAchievement(achievement.id);
          newlyUnlocked.push(achievement);
        }
      }
    }

    // Re-fetch progress AFTER unlocking some achievements so
    // Master of Modes sees the updated state.
    const updatedProgress = achievementService.getAchievementProgress();
    this.checkMasterOfModes(updatedProgress, newlyUnlocked);

    return newlyUnlocked;
  },

  // Special logic for Master of Modes achievement
  checkMasterOfModes(
    progress: Record<string, { unlocked?: boolean }>,
    newlyUnlocked: Achievement[]
  ): void {
    const masterAchievement = ACHIEVEMENTS.find(a => a.id === 'master-modes');
    if (!masterAchievement || progress['master-modes']?.unlocked) return;

    // Count unlocked achievements per mode
    const classicUnlocked =
      ACHIEVEMENTS.filter(
        a => a.category === 'classic' && progress[a.id]?.unlocked
      ).length;

    const rainbowUnlocked =
      ACHIEVEMENTS.filter(
        a => a.category === 'rainbow' && progress[a.id]?.unlocked
      ).length;

    if (classicUnlocked >= 3 && rainbowUnlocked >= 3) {
      achievementService.unlockAchievement('master-modes');
      newlyUnlocked.push(masterAchievement);
    }
  },

  // Get all achievements with progress
  getAllAchievementsWithProgress() {
    const progress = achievementService.getAchievementProgress();

    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      progress: progress[achievement.id] || {
        id: achievement.id,
        unlocked: false,
        progress: 0,
        // unlockedAt is optional; fine to be undefined until set
      },
    }));
  },
};
