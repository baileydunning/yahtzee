import { AchievementProgress, AllTimeStats } from '@/types/achievements';
import { HighScore } from '@/types/game';

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
  // Update stats after a game completes
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

    if (lastGameDate) {
      const prev = new Date(lastGameDate);
      const curr = new Date(today);
      const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        stats.streak = (stats.streak || 0) + 1;
      } else if (diffDays > 1) {
        stats.streak = 1;
      }
    } else {
      stats.streak = 1;
    }

    // Check for perfect game (no zeroes in any scored category)
        let isPerfectGame = false;
        if (highScore.scorecard) {
          // Exclude bonusYahtzees from check
          const nonBonusValues = Object.entries(highScore.scorecard)
            .filter(([k]) => k !== 'bonusYahtzees')
            .map(([_, v]) => v)
            .filter(v => typeof v === 'number');
          isPerfectGame = nonBonusValues.every(v => v !== 0);
          if (isPerfectGame) {
            stats.perfectGamesCompleted = (stats.perfectGamesCompleted || 0) + 1;
          }
        }

    if (highScore.mode === 'classic') {
      stats.classicGamesCompleted += 1;
      stats.classicHighScores.push(highScore.score);

      // update best classic score
      if (highScore.score > stats.bestClassicScore) {
        stats.bestClassicScore = highScore.score;
      }

      // calculate average for classic
      if (stats.classicHighScores.length > 0) {
        const sum = stats.classicHighScores.reduce((acc, val) => acc + val, 0);
        stats.classicAverage = Math.round(sum / stats.classicHighScores.length);
      } else {
        stats.classicAverage = 0;
      }

      if (highScore.scorecard) {
        // Count Yahtzees & bonus Yahtzees
        if (highScore.scorecard.yahtzee === 50) {
          const bonus = highScore.scorecard.bonusYahtzees || 0;
          stats.totalYahtzeesInClassic += 1 + bonus;
          stats.classicBonusYahtzees += bonus;
        }

        // Upper bonus
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

        // 4-of-a-Kind 25+
        if (
          highScore.scorecard.fourOfKind &&
          highScore.scorecard.fourOfKind >= 25
        ) {
          stats.fourOfKind25Plus += 1;
        }

        // Both straights
        if (
          highScore.scorecard.smallStraight &&
          highScore.scorecard.smallStraight > 0 &&
          highScore.scorecard.largeStraight &&
          highScore.scorecard.largeStraight > 0
        ) {
          stats.straightShooterGames += 1;
        }

        // 275+ games
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

      // update best rainbow score
      if (highScore.score > stats.bestRainbowScore) {
        stats.bestRainbowScore = highScore.score;
      }

      // calculate average for rainbow
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

    // Check if both modes played
    if (stats.classicGamesCompleted > 0 && stats.rainbowGamesCompleted > 0) {
      stats.bothModesPlayed = true;
    }

    this.saveAllTimeStats(stats);
  },

  clearAllData(): void {
    localStorage.removeItem(ACHIEVEMENT_PROGRESS_KEY);
    localStorage.removeItem(ALL_TIME_STATS_KEY);
    localStorage.removeItem(HIGH_SCORES_KEY);
  },
};
