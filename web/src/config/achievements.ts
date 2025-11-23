import { Achievement } from '@/types/achievements';

// Helpers to ensure we only evaluate *finished* games
const isClassicCardComplete = (s: any | null | undefined): boolean => {
    if (!s) return false;
    const requiredKeys = [
        'aces', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeOfKind', 'fourOfKind', 'fullHouse',
        'smallStraight', 'largeStraight', 'yahtzee', 'chance',
    ];
    return requiredKeys.every(key => typeof s[key] === 'number');
};

const isRainbowCardComplete = (s: any | null | undefined): boolean => {
    if (!s) return false;
    const requiredKeys = [
        // classic-ish part
        'aces', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeOfKind', 'fourOfKind', 'fullHouse',
        'smallStraight', 'largeStraight', 'yahtzee', 'chance',
        // rainbow part
        'allRed', 'allBlue', 'allGreen', 'allYellow', 'allPurple',
        'threeColorMix', 'fourColorMix', 'rainbowBonus',
    ];
    return requiredKeys.every(key => typeof s[key] === 'number');
};

export const ACHIEVEMENTS: Achievement[] = [

    // ============================================
    // DUAL MODE ACHIEVEMENTS
    // ============================================
    {
        id: 'mode-explorer',
        title: 'Mode Explorer',
        description: 'Play a game in both Classic and Rainbow Mode',
        category: 'dual',
        modes: ['classic', 'rainbow'],
        icon: '🗺️',
        checkCondition: (ctx) => ctx.allTimeStats.bothModesPlayed,
    },
    {
        id: 'dual-champion',
        title: 'Dual Champion',
        description: 'Score 250+ in Classic and 400+ in Rainbow',
        category: 'dual',
        modes: ['classic', 'rainbow'],
        icon: '🏆',
        checkCondition: (ctx) => {
            const c250 = ctx.allTimeStats.classicHighScores.some(s => s >= 250);
            const r400 = ctx.allTimeStats.rainbowHighScores.some(s => s >= 400);
            return c250 && r400;
        },
    },
    {
        id: 'score-milestone',
        title: 'Score Milestone',
        description: 'Score a total of 5,000 points across all games',
        category: 'dual',
        modes: ['classic', 'rainbow'],
        icon: '💯',
        target: 5000,
        checkCondition: (ctx) => {
            const totalClassicPoints = ctx.allTimeStats.classicHighScores.reduce((a, b) => a + b, 0);
            const totalPoints = totalClassicPoints + ctx.allTimeStats.totalRainbowPoints;
            return totalPoints;
        },
    },
    {
        id: 'score-machine',
        title: 'Score Machine',
        description: 'Score a total of 25,000 points across all games',
        category: 'dual',
        modes: ['classic', 'rainbow'],
        icon: '🔢',
        target: 25000,
        checkCondition: (ctx) => {
            const totalClassicPoints = Array.isArray(ctx.allTimeStats.classicHighScores)
                ? ctx.allTimeStats.classicHighScores.reduce((a, b) => a + b, 0)
                : 0;
            const totalRainbowPoints = ctx.allTimeStats.totalRainbowPoints ?? 0;
            return totalClassicPoints + totalRainbowPoints;
        },
    },
    {
        id: 'yahtzee-hunter',
        title: 'Yahtzee Hunter',
        description: 'Earn 20 Yahtzees across all games',
        category: 'dual',
        modes: ['classic', 'rainbow'],
        icon: '🧛‍♂️',
        target: 20,
        checkCondition: (ctx) => {
            const classicYahtzees = ctx.allTimeStats.totalYahtzeesInClassic ?? 0;
            const rainbowYahtzees = ctx.allTimeStats.totalYahtzeesInRainbow ?? 0;
            return classicYahtzees + rainbowYahtzees;
        },
    },
    {
        id: 'game-grinder',
        title: 'Game Grinder',
        description: 'Play 50 games in total',
        category: 'dual',
        modes: ['classic', 'rainbow'],
        icon: '🕹️',
        target: 50,
        checkCondition: (ctx) => ctx.allTimeStats.totalGames ?? 0,
    },
    {
        id: 'persistence-pays',
        title: 'Persistence Pays',
        description: 'Play 100 games in total',
        category: 'dual',
        modes: ['classic', 'rainbow'],
        icon: '⏳',
        target: 100,
        checkCondition: (ctx) => ctx.allTimeStats.totalGames ?? 0,
    },
    {
        id: 'no-miss',
        title: 'No Miss',
        description: 'Finish a game in either mode with zero zeroes on your scorecard',
        category: 'dual',
        modes: ['classic', 'rainbow'],
        icon: '🧼',
        checkCondition: (ctx) => {
            const s = ctx.classicScores || ctx.rainbowScores;
            if (!s) return false;
            return Object.values(s).filter(v => typeof v === 'number' && v === 0).length === 0;
        },
    },
    
    // ============================================
    // RAINBOW MODE ACHIEVEMENTS (per-game ones check full card)
    // ============================================
    {
        id: 'color-collector',
        title: 'Color Collector',
        description: 'Complete at least three color bonuses in a game',
        category: 'rainbow',
        modes: ['rainbow'],
        icon: '🦚', // Color Collector
        checkCondition: (ctx) => {
            const s = ctx.rainbowScores;
            if (!isRainbowCardComplete(s)) return false;
            const colorBonuses = [
                s.allRed,
                s.allBlue,
                s.allGreen,
                s.allYellow,
                s.allPurple,
            ];
            return colorBonuses.filter(score => score !== null && score > 0).length >= 3;
        },
    },
    {
        id: 'taste-rainbow',
        title: 'Taste the Rainbow',
        description: 'Score five different color categories',
        category: 'rainbow',
        modes: ['rainbow'],
        icon: '😛', // Taste the Rainbow
        checkCondition: (ctx) => {
            const s = ctx.rainbowScores;
            if (!isRainbowCardComplete(s)) return false;
            const singleColors = [
                s.allRed,
                s.allBlue,
                s.allGreen,
                s.allYellow,
                s.allPurple,
            ];
            return singleColors.filter(score => score !== null && score > 0).length >= 5;
        },
    },
    {
        id: 'double-rainbow',
        title: 'Double Rainbow',
        description: 'Score in at least two different all color categories',
        category: 'rainbow',
        modes: ['rainbow'],
        icon: '💕',
        checkCondition: (ctx) => {
            const s = ctx.rainbowScores;
            if (!isRainbowCardComplete(s)) return false;
            const colorCats = [s.allRed, s.allBlue, s.allGreen, s.allYellow, s.allPurple];
            // Must have at least two color categories with a score >= 50
            return colorCats.filter(score => typeof score === 'number' && score >= 50).length >= 2;
        },
    },
    {
        id: 'color-strategist',
        title: 'Color Strategist',
        description: 'Score 20+ points from rainbow categories five times in a single game',
        category: 'rainbow',
        modes: ['rainbow'],
        icon: '👨‍🎨',
        checkCondition: (ctx) => {
            const s = ctx.rainbowScores;
            if (!isRainbowCardComplete(s)) return false;
            const cats = [
                s.allRed,
                s.allBlue,
                s.allGreen,
                s.allYellow,
                s.allPurple,
                s.threeColorMix,
                s.fourColorMix,
                s.rainbowBonus,
            ];
            return cats.filter(score => score !== null && score >= 20).length >= 5;
        },
    },
    {
        id: 'full-spectrum',
        title: 'Full Spectrum',
        description: 'Score a non-zero value in every rainbow category in a completed Rainbow game',
        category: 'rainbow',
        modes: ['rainbow'],
        icon: '🌈',
        checkCondition: (ctx) => {
            const s = ctx.rainbowScores;
            if (!isRainbowCardComplete(s)) return false;

            const rainbowSpecific = [
                s.allRed,
                s.allBlue,
                s.allGreen,
                s.allYellow,
                s.allPurple,
                s.threeColorMix,
                s.fourColorMix,
                s.rainbowBonus,
            ];

            // must be filled AND > 0
            return rainbowSpecific.every(v => v !== null && v !== undefined && v > 0);
        },
    },
    {
        id: 'color-chain-master',
        title: 'Color Chain Master',
        description: 'Score a complete increasing color chain',
        category: 'rainbow',
        modes: ['rainbow'],
        icon: '🔗', // Color Chain Master
        checkCondition: (ctx) => {
            const s = ctx.rainbowScores;
            if (!isRainbowCardComplete(s)) return false;
            return (
                s.threeColorMix !== null && s.threeColorMix > 0 &&
                s.fourColorMix !== null && s.fourColorMix > 0 &&
                s.rainbowBonus !== null && s.rainbowBonus > 0
            );
        },
    },
    {
        id: 'rainbow-straight-shooter',
        title: 'Rainbow Straight Shooter',
        description: 'Score both straights and complete a rainbow set in one game',
        category: 'rainbow',
        modes: ['rainbow'],
        icon: '🌀', // Rainbow Straight Shooter (cyclone)
        checkCondition: (ctx) => {
            const s = ctx.rainbowScores;
            if (!isRainbowCardComplete(s)) return false;

            return (
                s.smallStraight > 0 &&
                s.largeStraight > 0 &&
                s.rainbowBonus > 0
            );
        },
    },
    {
        id: 'colorful-kinds',
        title: 'Colorful Kinds',
        description: 'Score 25+ in 3-of-a-kind, 30+ in 4-of-a-kind, and 15+ in three rainbow categories',
        category: 'rainbow',
        modes: ['rainbow'],
        icon: '👽',
        checkCondition: (ctx) => {
            const s = ctx.rainbowScores;
            if (!isRainbowCardComplete(s)) return false;

            const rainbowCats = [
                s.allRed, s.allBlue, s.allGreen, s.allYellow, s.allPurple,
                s.threeColorMix, s.fourColorMix, s.rainbowBonus,
            ];

            const high = rainbowCats.filter(v => v !== null && v >= 15).length;

            return (
                (s.threeOfKind ?? 0) >= 25 &&
                (s.fourOfKind ?? 0) >= 30 &&
                high >= 3
            );
        },
    },
    {
        id: 'spectrum-yahtzee',
        title: 'Spectrum Yahtzee',
        description: 'Score Yahtzee and complete a full rainbow set in the same game',
        category: 'rainbow',
        modes: ['rainbow'],
        icon: '✨', // Spectrum Yahtzee (sparkles)
        checkCondition: (ctx) => {
            const s = ctx.rainbowScores;
            if (!isRainbowCardComplete(s)) return false;

            return s.yahtzee === 50 && s.rainbowBonus > 0;
        },
    },

    // ============================================
    // CLASSIC MODE ACHIEVEMENTS
    // ============================================
    {
        id: 'solid-start',
        title: 'Solid Start',
        description: 'Finish a Classic game with no more than 4 zeroes',
        category: 'classic',
        modes: ['classic'],
        icon: '😎',
        checkCondition: (ctx) => {
            const s = ctx.classicScores;
            if (!isClassicCardComplete(s)) return false;

            const all = [
                s.aces, s.twos, s.threes, s.fours, s.fives, s.sixes,
                s.threeOfKind, s.fourOfKind, s.fullHouse,
                s.smallStraight, s.largeStraight, s.yahtzee, s.chance,
            ];

            const zeroCount = all.filter(v => v === 0).length;
            return zeroCount <= 4;
        },
    },
    {
        id: 'warm-up-roll',
        title: 'Warm-Up Roll',
        description: 'Score 20+ in 3-of-a-kind',
        category: 'classic',
        modes: ['classic'],
        icon: '🔥',
        checkCondition: (ctx) => {
            const s = ctx.classicScores;
            if (!isClassicCardComplete(s)) return false;
            return s.threeOfKind !== null && s.threeOfKind >= 20;
        },
    },
    {
        id: 'upper-veteran',
        title: 'Upper Section Veteran',
        description: 'Earn the upper bonus 10 times',
        category: 'classic',
        modes: ['classic'],
        icon: '⭐',
        target: 10,
        checkCondition: (ctx) => ctx.allTimeStats.upperBonusesEarned,
    },
    {
        id: 'big-roller',
        title: 'Big Roller',
        description: 'Score 26+ in Chance in a finished Classic game',
        category: 'classic',
        modes: ['classic'],
        icon: '🎰',
        checkCondition: (ctx) => {
            const s = ctx.classicScores;
            if (!isClassicCardComplete(s)) return false;

            return s.chance !== null && s.chance >= 26;
        },
    },
    {
        id: 'dice-commander',
        title: 'Dice Commander',
        description: 'Score 30+ in 4-of-a-kind three times',
        category: 'classic',
        modes: ['classic'],
        icon: '🎖️',
        target: 3,
        checkCondition: (ctx) => ctx.allTimeStats.fourOfKind30Plus,
    },
    {
        id: 'straight-shooter-pro',
        title: 'Straight Shooter Pro',
        description: 'Score Small & Large Straight in 5 Classic games',
        category: 'classic',
        modes: ['classic'],
        icon: '🎲',
        target: 5,
        checkCondition: (ctx) => ctx.allTimeStats.straightShooterGames,
    },
    {
        id: 'classic-grinder',
        title: 'Classic Grinder',
        description: 'Complete 20 Classic games',
        category: 'classic',
        modes: ['classic'],
        icon: '💪',
        target: 20,
        checkCondition: (ctx) => ctx.allTimeStats.classicGamesCompleted,
    },
    {
        id: 'classic-champion',
        title: 'Classic Champion',
        description: 'Score 275+ in five Classic games',
        category: 'classic',
        modes: ['classic'],
        icon: '👑',
        target: 5,
        checkCondition: (ctx) => ctx.allTimeStats.classic275PlusGames,
    },
    {
        id: 'precision-player',
        title: 'Precision Player',
        description: 'No category under 12 (except Aces/Twos allowed)',
        category: 'classic',
        modes: ['classic'],
        icon: '🎯',
        checkCondition: (ctx) => {
            const s = ctx.classicScores;
            if (!isClassicCardComplete(s)) return false;
            const cats = [
                s.threes, s.fours, s.fives, s.sixes,
                s.threeOfKind, s.fourOfKind, s.fullHouse,
                s.smallStraight, s.largeStraight, s.yahtzee, s.chance,
            ];
            return cats.every(score => score === null || score >= 12);
        },
    },
    {
        id: 'three-yahtzee-special',
        title: 'Three-Yahtzee Special',
        description: 'Earn three Yahtzees in Classic Mode total',
        category: 'classic',
        modes: ['classic'],
        icon: '🎰',
        target: 3,
        checkCondition: (ctx) => ctx.allTimeStats.totalYahtzeesInClassic,
    },
    {
        id: 'golden-game',
        title: 'Golden Game',
        description: 'Finish a Classic game with zero lower-section zeroes',
        category: 'classic',
        modes: ['classic'],
        icon: '🥇',
        checkCondition: (ctx) => {
            const s = ctx.classicScores;
            if (!isClassicCardComplete(s)) return false;
            const lower = [
                s.threeOfKind,
                s.fourOfKind,
                s.fullHouse,
                s.smallStraight,
                s.largeStraight,
                s.yahtzee,
                s.chance,
            ];
            return lower.every(score => score !== null && score > 0);
        },
    },
    {
        id: 'bonus-blitz-classic',
        title: 'Bonus Blitz',
        description: 'Score 2 or more Bonus Yahtzees in a single completed Classic game',
        category: 'classic',
        modes: ['classic'],
        icon: '🌠',
        checkCondition: (ctx) => {
            const s = ctx.classicScores;
            if (!isClassicCardComplete(s)) return false;

            return (
                s.yahtzee === 50 &&
                typeof s.bonusYahtzees === 'number' &&
                s.bonusYahtzees >= 2
            );
        },
    },
    {
        id: 'bonus-frenzy-classic',
        title: 'Bonus Frenzy',
        description: 'Score 3 or more Bonus Yahtzees in a single completed Classic game',
        category: 'classic',
        modes: ['classic'],
        icon: '🫟',
        checkCondition: (ctx) => {
            const s = ctx.classicScores;
            if (!isClassicCardComplete(s)) return false;

            return (
                s.yahtzee === 50 &&
                typeof s.bonusYahtzees === 'number' &&
                s.bonusYahtzees >= 3
            );
        },
    },
];
