import { GameMode, ClassicScores, RainbowScores } from './game';

export type AchievementCategory = 'rainbow' | 'classic' | 'dual';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    category: AchievementCategory;
    modes: GameMode[];
    icon: string; // emoji
    // Progress tracking
    target?: number; // for incremental achievements
    checkCondition: (context: AchievementContext) => boolean | number;
}

export interface AchievementProgress {
    id: string;
    unlocked: boolean;
    unlockedAt?: string;
    progress: number; // current progress towards target
}

export interface AchievementContext {
    // Current game data
    mode: GameMode;
    classicScores: ClassicScores | null;
    rainbowScores: RainbowScores | null;

    // Historical data from achievementService
    allTimeStats: AllTimeStats;
    unlockedAchievementIds: string[];
}

export interface AllTimeStats {
    // Core counters
    classicGamesCompleted: number;
    rainbowGamesCompleted: number;
    classicHighScores: number[];   // all classic scores (for averages / history)
    rainbowHighScores: number[];   // all rainbow scores
    totalYahtzeesInClassic: number;
    totalYahtzeesInRainbow: number;
    upperBonusesEarned: number;
    threeOfKind20Plus: number;
    fourOfKind25Plus: number;
    straightShooterGames: number;  // games with both straights in Classic
    classic275PlusGames: number;
    rainbow400PlusGames: number;
    totalRainbowPoints: number;
    bothModesPlayed: boolean;
    perfectGamesCompleted: number;
    streak: number;

    // Derived / summary stats
    totalGames: number;
    bestClassicScore: number;
    bestRainbowScore: number;
    classicAverage: number;
    rainbowAverage: number;
    lastGameDate: string | null;
    lastUpdated: string | null;

    // Bonus Yahtzee tracking (for achievements)
    classicBonusYahtzees: number;
    rainbowBonusYahtzees: number;
}

