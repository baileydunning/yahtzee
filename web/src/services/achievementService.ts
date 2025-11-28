import { AchievementProgress, AllTimeStats } from '@/types/achievements';
import { GameMode, HighScore } from '@/types/game';

const ACHIEVEMENT_PROGRESS_KEY = 'yahtzee_achievement_progress';
const ALL_TIME_STATS_KEY = 'yahtzee_all_time_stats';
const HIGH_SCORES_KEY = 'yahtzee_high_scores';

const DEFAULT_ALL_TIME_STATS: AllTimeStats = {
  classicGamesCompleted: 0,
  rainbowGamesCompleted: 0,
  classicHighScores: [],
  rainbowHighScores: [],
  totalYahtzeesInClassic: 0,
  totalYahtzeesInRainbow: 0,
  upperBonusesEarned: 0,
  threeOfKind20Plus: 0,
  fourOfKind25Plus: 0,
  straightShooterGames: 0,
  classic275PlusGames: 0,
  rainbow400PlusGames: 0,
  totalRainbowPoints: 0,
  bothModesPlayed: false,
  totalGames: 0,
  bestClassicScore: 0,
  bestRainbowScore: 0,
  classicAverage: 0,
  rainbowAverage: 0,
  lastGameDate: null,
  lastUpdated: null,
  classicBonusYahtzees: 0,
  rainbowBonusYahtzees: 0,
  streak: 0,
  perfectGamesCompleted: 0,
  puzzlesPlayed: 0,
  puzzlesSolved: 0,
  classicPuzzlesSolved: 0,
  rainbowPuzzlesSolved: 0,
  puzzlePerfects: 0,
};

export const achievementService = {
  // -----------------------------
  // Achievement progress
  // -----------------------------
  getAchievementProgress(): Record<string, AchievementProgress> {
    const data = localStorage.getItem(ACHIEVEMENT_PROGRESS_KEY);
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse achievement progress, resetting.', e);
      return {};
    }
  },

  saveAchievementProgress(progress: Record<string, AchievementProgress>): void {
    localStorage.setItem(ACHIEVEMENT_PROGRESS_KEY, JSON.stringify(progress));
  },

  unlockAchievement(achievementId: string): void {
    const progress = this.getAchievementProgress();
    progress[achievementId] = {
      id: achievementId,
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      progress: progress[achievementId]?.progress || 0,
    };
    this.saveAchievementProgress(progress);
  },

  updateProgress(achievementId: string, newProgress: number): void {
    const progress = this.getAchievementProgress();
    if (!progress[achievementId]) {
      progress[achievementId] = {
        id: achievementId,
        unlocked: false,
        progress: 0,
      };
    }
    progress[achievementId].progress = newProgress;
    this.saveAchievementProgress(progress);
  },

  // -----------------------------
  // Local high scores (for graphs, etc.)
  // -----------------------------
  getLocalHighScores(): HighScore[] {
    const raw = localStorage.getItem(HIGH_SCORES_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as HighScore[];
    } catch (e) {
      console.warn('Failed to parse local high scores, resetting.', e);
      return [];
    }
  },

  saveLocalHighScores(scores: HighScore[]): void {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
  },

  // -----------------------------
  // All-time stats
  // -----------------------------
  getAllTimeStats(): AllTimeStats {
    const raw = localStorage.getItem(ALL_TIME_STATS_KEY);
    if (!raw) {
      return { ...DEFAULT_ALL_TIME_STATS };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<AllTimeStats>;
      // merge so new fields always have defaults
      return {
        ...DEFAULT_ALL_TIME_STATS,
        ...parsed,
      };
    } catch (e) {
      console.warn('Failed to parse all-time stats, resetting.', e);
      return { ...DEFAULT_ALL_TIME_STATS };
    }
  },

  saveAllTimeStats(stats: AllTimeStats): void {
    const withMeta: AllTimeStats = {
      ...DEFAULT_ALL_TIME_STATS,
      ...stats,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(ALL_TIME_STATS_KEY, JSON.stringify(withMeta));
  },

  // -----------------------------
  // Update stats after a normal game completes
  // -----------------------------
  updateStatsAfterGame(highScore: HighScore): void {
    // 1) Append this game to the local high score history
    const existingScores = this.getLocalHighScores();
    existingScores.push(highScore);
    this.saveLocalHighScores(existingScores);

    // 2) Update aggregate stats
    const stats = this.getAllTimeStats();
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const lastGameDate = stats.lastGameDate ? stats.lastGameDate.slice(0, 10) : null;

    // Streak handling
    if (!lastGameDate) {
      // First game ever, start streak at 1
      stats.streak = 1;
    } else {
      const prev = new Date(lastGameDate);
      const curr = new Date(today);
      const diffDays = Math.floor(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        // Same day, keep streak
        stats.streak = stats.streak || 1;
      } else if (diffDays === 1) {
        // Consecutive day
        stats.streak = (stats.streak || 1) + 1;
      } else if (diffDays > 1) {
        // Missed one+ days, reset
        stats.streak = 1;
      }
    }

    // Perfect game check (no zeroes), ignoring bonusYahtzees
    if (highScore.scorecard) {
      const nonBonusValues = Object.entries(highScore.scorecard)
        .filter(([key]) => key !== 'bonusYahtzees')
        .map(([_, val]) => val)
        .filter((v) => typeof v === 'number');
      const isPerfectGame = nonBonusValues.every((v) => v !== 0);

      if (isPerfectGame) {
        stats.perfectGamesCompleted = (stats.perfectGamesCompleted || 0) + 1;
      }
    }

    if (highScore.mode === 'classic') {
      stats.classicGamesCompleted += 1;
      stats.classicHighScores.push(highScore.score);

      // Best classic score
      if (highScore.score > stats.bestClassicScore) {
        stats.bestClassicScore = highScore.score;
      }

      // Classic average
      if (stats.classicHighScores.length > 0) {
        const sum = stats.classicHighScores.reduce((acc, val) => acc + val, 0);
        stats.classicAverage = Math.round(sum / stats.classicHighScores.length);
      } else {
        stats.classicAverage = 0;
      }

      if (highScore.scorecard) {
        // Yahtzees & bonus Yahtzees
        if (highScore.scorecard.yahtzee === 50) {
          const bonus = highScore.scorecard.bonusYahtzees || 0;
          stats.totalYahtzeesInClassic += 1 + bonus;
          stats.classicBonusYahtzees += bonus;
        }

        // Upper section
        const upperTotal =
          (highScore.scorecard.aces || 0) +
          (highScore.scorecard.twos || 0) +
          (highScore.scorecard.threes || 0) +
          (highScore.scorecard.fours || 0) +
          (highScore.scorecard.fives || 0) +
          (highScore.scorecard.sixes || 0);

        if (upperTotal >= 63) {
          stats.upperBonusesEarned += 1;
        }

        // 3-of-a-kind 20+
        if (
          highScore.scorecard.threeOfKind &&
          highScore.scorecard.threeOfKind >= 20
        ) {
          stats.threeOfKind20Plus += 1;
        }

        // 4-of-a-kind 25+
        if (
          highScore.scorecard.fourOfKind &&
          highScore.scorecard.fourOfKind >= 25
        ) {
          stats.fourOfKind25Plus += 1;
        }

        // Both straights in one game
        if (
          highScore.scorecard.smallStraight &&
          highScore.scorecard.smallStraight > 0 &&
          highScore.scorecard.largeStraight &&
          highScore.scorecard.largeStraight > 0
        ) {
          stats.straightShooterGames += 1;
        }

        // 275+ classic games
        if (highScore.score >= 275) {
          stats.classic275PlusGames += 1;
        }
      }
    } else if (highScore.mode === 'rainbow') {
      stats.rainbowGamesCompleted += 1;
      stats.rainbowHighScores.push(highScore.score);
      stats.totalRainbowPoints += highScore.score;

      if (highScore.scorecard.yahtzee === 50) {
        const bonus = highScore.scorecard.bonusYahtzees || 0;
        stats.totalYahtzeesInRainbow += 1 + bonus;
        stats.rainbowBonusYahtzees += bonus;
      }

      // Best rainbow score
      if (highScore.score > stats.bestRainbowScore) {
        stats.bestRainbowScore = highScore.score;
      }

      // Rainbow average
      if (stats.rainbowHighScores.length > 0) {
        const sum = stats.rainbowHighScores.reduce((acc, val) => acc + val, 0);
        stats.rainbowAverage = Math.round(sum / stats.rainbowHighScores.length);
      } else {
        stats.rainbowAverage = 0;
      }

      if (highScore.score >= 400) {
        stats.rainbow400PlusGames += 1;
      }

      if (highScore.scorecard) {
        const bonus = highScore.scorecard.bonusYahtzees || 0;
        stats.rainbowBonusYahtzees += bonus;
      }
    }

    // Derived fields
    stats.totalGames =
      (stats.classicGamesCompleted || 0) +
      (stats.rainbowGamesCompleted || 0);

    stats.lastGameDate = highScore.date || new Date().toISOString();

    // Both modes played?
    if (stats.classicGamesCompleted > 0 && stats.rainbowGamesCompleted > 0) {
      stats.bothModesPlayed = true;
    }

    this.saveAllTimeStats(stats);
  },

  // -----------------------------
  // Update stats after a puzzle completes
  // -----------------------------
  updateStatsAfterPuzzle(args: {
    puzzleId: string;
    mode: GameMode;
    success: boolean;
    perfect: boolean;
  }): void {
    const stats = this.getAllTimeStats();

    // Every attempt counts as a played puzzle
    stats.puzzlesPlayed += 1;

    if (args.success) {
      stats.puzzlesSolved += 1;

      if (args.mode === 'classic') {
        stats.classicPuzzlesSolved += 1;
      } else if (args.mode === 'rainbow') {
        stats.rainbowPuzzlesSolved += 1;
      }

      if (args.perfect) {
        stats.puzzlePerfects += 1;
      }
    }

    this.saveAllTimeStats(stats);
  },

  // -----------------------------
  // Clear EVERYTHING (progress + stats + high scores)
  // -----------------------------
  clearAllData(): void {
    localStorage.removeItem(ACHIEVEMENT_PROGRESS_KEY);
    localStorage.removeItem(ALL_TIME_STATS_KEY);
    localStorage.removeItem(HIGH_SCORES_KEY);
  },
};
