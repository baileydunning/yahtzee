import { Achievement, AchievementContext } from '@/types/achievements';
import { PUZZLES } from './puzzles';

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
      const c250 = ctx.allTimeStats.classicHighScores.some((s: number) => s >= 250);
      const r400 = ctx.allTimeStats.rainbowHighScores.some((s: number) => s >= 400);
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
      const totalClassicPoints = Array.isArray(ctx.allTimeStats.classicHighScores)
        ? ctx.allTimeStats.classicHighScores.reduce((a: number, b: number) => a + b, 0)
        : 0;
      const totalRainbowPoints = Array.isArray(ctx.allTimeStats.rainbowHighScores)
        ? ctx.allTimeStats.rainbowHighScores.reduce((a: number, b: number) => a + b, 0)
        : 0;
      return totalClassicPoints + totalRainbowPoints;
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
        ? ctx.allTimeStats.classicHighScores.reduce((a: number, b: number) => a + b, 0)
        : 0;
      const totalRainbowPoints = Array.isArray(ctx.allTimeStats.rainbowHighScores)
        ? ctx.allTimeStats.rainbowHighScores.reduce((a: number, b: number) => a + b, 0)
        : 0;
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
    id: 'yahtzee-legend',
    title: 'Yahtzee Legend',
    description: 'Earn 50 Yahtzees across all games',
    category: 'dual',
    modes: ['classic', 'rainbow'],
    icon: '🧙‍♂️',
    target: 50,
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
  {
    id: 'bonus-binge',
    title: 'Bonus Binge',
    description: 'Earn 10 Bonus Yahtzees across all games',
    category: 'dual',
    modes: ['classic', 'rainbow'],
    icon: '🍻',
    target: 10,
    checkCondition: (ctx) => {
      const classicBonus = ctx.allTimeStats.classicBonusYahtzees ?? 0;
      const rainbowBonus = ctx.allTimeStats.rainbowBonusYahtzees ?? 0;
      return classicBonus + rainbowBonus;
    },
  },
  {
    id: 'comeback-artist',
    title: 'Comeback Artist',
    description: 'Score 300+ in a game despite having at least three zeroes',
    category: 'dual',
    modes: ['classic', 'rainbow'],
    icon: '🎭',
    checkCondition: (ctx) => {
      const s = ctx.classicScores || ctx.rainbowScores;
      if (!s) return false;

      let score = 0;
      if (ctx.mode === 'classic') {
        score = ctx.classicScores
          ? (ctx.classicScores.aces ?? 0) +
            (ctx.classicScores.twos ?? 0) +
            (ctx.classicScores.threes ?? 0) +
            (ctx.classicScores.fours ?? 0) +
            (ctx.classicScores.fives ?? 0) +
            (ctx.classicScores.sixes ?? 0) +
            (ctx.classicScores.threeOfKind ?? 0) +
            (ctx.classicScores.fourOfKind ?? 0) +
            (ctx.classicScores.fullHouse ?? 0) +
            (ctx.classicScores.smallStraight ?? 0) +
            (ctx.classicScores.largeStraight ?? 0) +
            (ctx.classicScores.yahtzee ?? 0) +
            (ctx.classicScores.chance ?? 0)
          : 0;
      } else {
        score = ctx.rainbowScores
          ? [
              ctx.rainbowScores.aces ?? 0,
              ctx.rainbowScores.twos ?? 0,
              ctx.rainbowScores.threes ?? 0,
              ctx.rainbowScores.fours ?? 0,
              ctx.rainbowScores.fives ?? 0,
              ctx.rainbowScores.sixes ?? 0,
              ctx.rainbowScores.threeOfKind ?? 0,
              ctx.rainbowScores.fourOfKind ?? 0,
              ctx.rainbowScores.fullHouse ?? 0,
              ctx.rainbowScores.smallStraight ?? 0,
              ctx.rainbowScores.largeStraight ?? 0,
              ctx.rainbowScores.yahtzee ?? 0,
              ctx.rainbowScores.chance ?? 0,
              ctx.rainbowScores.allRed ?? 0,
              ctx.rainbowScores.allBlue ?? 0,
              ctx.rainbowScores.allGreen ?? 0,
              ctx.rainbowScores.allYellow ?? 0,
              ctx.rainbowScores.allPurple ?? 0,
              ctx.rainbowScores.threeColorMix ?? 0,
              ctx.rainbowScores.fourColorMix ?? 0,
              ctx.rainbowScores.rainbowBonus ?? 0,
            ].reduce((a, b) => a + b, 0)
          : 0;
      }

      const finalScore = score;
      const zeroCount = Object.values(s)
        .filter(v => typeof v === 'number' && v === 0).length;

      return zeroCount >= 3 && finalScore >= 300;
    },
  },
  {
    id: 'unlucky-genius',
    title: 'Unlucky Genius',
    description: 'Finish a game with a zeroed Yahtzee but still score 400+ points',
    category: 'dual',
    modes: ['classic', 'rainbow'],
    icon: '🤕',
    checkCondition: (ctx) => {
      const s = ctx.classicScores || ctx.rainbowScores;
      if (!s) return false;

      const finalScore =
        ctx.mode === 'classic'
          ? (
              (ctx.classicScores?.aces ?? 0) +
              (ctx.classicScores?.twos ?? 0) +
              (ctx.classicScores?.threes ?? 0) +
              (ctx.classicScores?.fours ?? 0) +
              (ctx.classicScores?.fives ?? 0) +
              (ctx.classicScores?.sixes ?? 0) +
              (ctx.classicScores?.threeOfKind ?? 0) +
              (ctx.classicScores?.fourOfKind ?? 0) +
              (ctx.classicScores?.fullHouse ?? 0) +
              (ctx.classicScores?.smallStraight ?? 0) +
              (ctx.classicScores?.largeStraight ?? 0) +
              (ctx.classicScores?.yahtzee ?? 0) +
              (ctx.classicScores?.chance ?? 0)
            )
          : (
              (ctx.rainbowScores?.aces ?? 0) +
              (ctx.rainbowScores?.twos ?? 0) +
              (ctx.rainbowScores?.threes ?? 0) +
              (ctx.rainbowScores?.fours ?? 0) +
              (ctx.rainbowScores?.fives ?? 0) +
              (ctx.rainbowScores?.sixes ?? 0) +
              (ctx.rainbowScores?.threeOfKind ?? 0) +
              (ctx.rainbowScores?.fourOfKind ?? 0) +
              (ctx.rainbowScores?.fullHouse ?? 0) +
              (ctx.rainbowScores?.smallStraight ?? 0) +
              (ctx.rainbowScores?.largeStraight ?? 0) +
              (ctx.rainbowScores?.yahtzee ?? 0) +
              (ctx.rainbowScores?.chance ?? 0) +
              (ctx.rainbowScores?.allRed ?? 0) +
              (ctx.rainbowScores?.allBlue ?? 0) +
              (ctx.rainbowScores?.allGreen ?? 0) +
              (ctx.rainbowScores?.allYellow ?? 0) +
              (ctx.rainbowScores?.allPurple ?? 0) +
              (ctx.rainbowScores?.threeColorMix ?? 0) +
              (ctx.rainbowScores?.fourColorMix ?? 0) +
              (ctx.rainbowScores?.rainbowBonus ?? 0)
            );

      return s.yahtzee === 0 && finalScore >= 400;
    },
  },
  {
    id: 'the-perfectionist',
    title: 'The Perfectionist',
    description: 'Finish 10 perfect games',
    category: 'dual',
    modes: ['classic', 'rainbow'],
    icon: '🧽',
    target: 10,
    checkCondition: (ctx) => ctx.allTimeStats.perfectGamesCompleted ?? 0,
  },
  {
    id: 'triple-threat',
    title: 'Triple Threat',
    description: 'Score a Yahtzee, Large Straight, and 4-of-a-kind in the same game',
    category: 'dual',
    modes: ['classic', 'rainbow'],
    icon: '🔺',
    checkCondition: (ctx) => {
      const s = ctx.classicScores || ctx.rainbowScores;
      if (!s) return false;

      const large = s.largeStraight > 0;
      const fourKind = s.fourOfKind > 0;
      const yahtzee = s.yahtzee === 50;

      return large && fourKind && yahtzee;
    },
  },
  {
    id: 'momentum-starter',
    title: 'Momentum Starter',
    description: 'Maintain a 3-day play streak',
    category: 'dual',
    modes: ['classic', 'rainbow'],
    icon: '🛫',
    target: 3,
    checkCondition: (ctx) => ctx.allTimeStats.streak ?? 0,
  },
  {
    id: 'daily-roller',
    title: 'Daily Roller',
    description: 'Maintain a 7-day play streak',
    category: 'dual',
    modes: ['classic', 'rainbow'],
    icon: '📅',
    target: 7,
    checkCondition: (ctx) => ctx.allTimeStats.streak ?? 0,
  },
  {
    id: 'monthly-master',
    title: 'Monthly Master',
    description: 'Maintain a 30-day play streak',
    category: 'dual',
    modes: ['classic', 'rainbow'],
    icon: '🏃‍♂️‍➡️',
    target: 30,
    checkCondition: (ctx) => ctx.allTimeStats.streak ?? 0,
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
    icon: '🦚',
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
      return colorBonuses.filter((score: number | null) => score !== null && score > 0).length >= 3;
    },
  },
  {
    id: 'taste-rainbow',
    title: 'Taste the Rainbow',
    description: 'Score five different color categories',
    category: 'rainbow',
    modes: ['rainbow'],
    icon: '😛',
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
      return singleColors.filter((score: number | null) => score !== null && score > 0).length >= 5;
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
      return colorCats.filter((score: number | null) => typeof score === 'number' && score >= 50).length >= 2;
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
      return cats.filter((score: number | null) => score !== null && score >= 20).length >= 5;
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

      return rainbowSpecific.every((v: number | null | undefined) => v !== null && v !== undefined && v > 0);
    },
  },
  {
    id: 'rainbow-rainmaker',
    title: 'Rainbow Rainmaker',
    description: 'Score 20,000 total points in Rainbow Mode',
    category: 'rainbow',
    modes: ['rainbow'],
    icon: '💧',
    target: 20000,
    checkCondition: (ctx) => ctx.allTimeStats.totalRainbowPoints ?? 0,
  },
  {
    id: 'color-chain-master',
    title: 'Color Chain Master',
    description: 'Score a complete increasing color chain',
    category: 'rainbow',
    modes: ['rainbow'],
    icon: '🔗',
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
    icon: '🌀',
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
    description: 'Score 20+ in 3-of-a-kind, 25+ in 4-of-a-kind, and 15+ in three rainbow categories',
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

      const high = rainbowCats.filter((v: number | null) => v !== null && v >= 15).length;

      return (
        (s.threeOfKind ?? 0) >= 20 &&
        (s.fourOfKind ?? 0) >= 25 &&
        high >= 3
      );
    },
  },
  {
    id: 'prismatic-peak',
    title: 'Prismatic Peak',
    description: 'Score 700+ in Rainbow Mode',
    category: 'rainbow',
    modes: ['rainbow'],
    icon: '🏔️',
    checkCondition: (ctx) => {
      const bestRainbow = ctx.allTimeStats.bestRainbowScore ?? 0;
      return bestRainbow >= 700;
    },
  },
  {
    id: 'rainbow-elite',
    title: 'Rainbow Elite',
    description: 'Score 400+ points in Rainbow 10 times',
    category: 'rainbow',
    modes: ['rainbow'],
    icon: '💠',
    target: 10,
    checkCondition: (ctx) => ctx.allTimeStats.rainbow400PlusGames ?? 0,
  },
  {
    id: 'chromatic-surge',
    title: 'Chromatic Surge',
    description: 'Score 200+ total points from rainbow-specific categories in a single Rainbow game',
    category: 'rainbow',
    modes: ['rainbow'],
    icon: '💥',
    checkCondition: (ctx) => {
      const s = ctx.rainbowScores;
      if (!isRainbowCardComplete(s)) return false;

      const rainbowCats = [
        s.allRed ?? 0,
        s.allBlue ?? 0,
        s.allGreen ?? 0,
        s.allYellow ?? 0,
        s.allPurple ?? 0,
        s.threeColorMix ?? 0,
        s.fourColorMix ?? 0,
        s.rainbowBonus ?? 0,
      ];

      const sum = rainbowCats.reduce((a: number, b: number) => a + b, 0);
      return sum >= 200;
    },
  },
  {
    id: 'spectrum-yahtzee',
    title: 'Spectrum Yahtzee',
    description: 'Score Yahtzee and complete a full rainbow set in the same game',
    category: 'rainbow',
    modes: ['rainbow'],
    icon: '✨',
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

      const zeroCount = all.filter((v: number | null) => v === 0).length;
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
    id: 'upper-ace',
    title: 'Upper Ace',
    description: 'Score 70 or more points in the upper section in a Classic game',
    category: 'classic',
    modes: ['classic'],
    icon: '🧠',
    checkCondition: (ctx) => {
      const s = ctx.classicScores;
      if (!isClassicCardComplete(s)) return false;
      const upperTotal =
        (s.aces ?? 0) +
        (s.twos ?? 0) +
        (s.threes ?? 0) +
        (s.fours ?? 0) +
        (s.fives ?? 0) +
        (s.sixes ?? 0);
      return upperTotal >= 70;
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
    description: 'Score 25+ in Chance in a finished Classic game',
    category: 'classic',
    modes: ['classic'],
    icon: '🎰',
    checkCondition: (ctx) => {
      const s = ctx.classicScores;
      if (!isClassicCardComplete(s)) return false;

      return s.chance !== null && s.chance >= 25;
    },
  },
  {
    id: 'dice-commander',
    title: 'Dice Commander',
    description: 'Score 25+ in 4-of-a-kind three times',
    category: 'classic',
    modes: ['classic'],
    icon: '🎖️',
    target: 3,
    checkCondition: (ctx) => ctx.allTimeStats.fourOfKind25Plus,
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
      return cats.every((score: number | null) => score === null || score >= 12);
    },
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
      return lower.every((score: number | null) => score !== null && score > 0);
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

  // ============================================
  // PUZZLE ACHIEVEMENTS
  // ============================================
  
{
  id: 'puzzle-first-clear',
  title: 'Puzzle Rookie',
  description: 'Complete your first puzzle',
  category: 'puzzle',
  modes: ['classic', 'rainbow'],
  icon: '🧩',
  checkCondition: (ctx: AchievementContext) => {
    const solved = ctx.allTimeStats.puzzlesSolved ?? 0;
    return solved >= 1;
  },
},
{
  id: 'puzzle-collector-10',
  title: 'Puzzle Fan',
  description: 'Complete 10 puzzles',
  category: 'puzzle',
  modes: ['classic', 'rainbow'],
  icon: '📚',
  target: 10,
  checkCondition: (ctx: AchievementContext) => {
    // numeric return so achievementEngine can use it as incremental progress
    return ctx.allTimeStats.puzzlesSolved ?? 0;
  },
},
{
  id: 'puzzle-pro',
  title: 'Puzzle Pro',
  description: 'Solve 25 puzzles',
  category: 'puzzle',
  modes: ['classic', 'rainbow'],
  icon: '🙌',
  target: 25,
  checkCondition: (ctx: AchievementContext) => {
    return ctx.allTimeStats.puzzlesSolved ?? 0;
  },
},
{
  id: 'puzzle-savant',
  title: 'Puzzle Savant',
  description: 'Solve 40 puzzles',
  category: 'puzzle',
  modes: ['classic', 'rainbow'],
  icon: '🤩',
  target: 40,
  checkCondition: (ctx: AchievementContext) => {
    return ctx.allTimeStats.puzzlesSolved ?? 0;
  },
},
{
  id: 'puzzle-tenacious',
  title: 'Tenacious Solver',
  description: 'Finally clear a puzzle after 10+ attempts on the same puzzle',
  category: 'puzzle',
  modes: ['classic', 'rainbow'],
  icon: '🧗‍♀️',
  checkCondition: (ctx: AchievementContext) => {
    if (!ctx.puzzleSuccess) return false;
    return (ctx.puzzleAttempts ?? 0) >= 10;
  },
},
{
  id: 'puzzle-unbreakable',
  title: 'Unbreakable Solver',
  description: 'Finally clear a puzzle after 20+ attempts on the same puzzle',
  category: 'puzzle',
  modes: ['classic', 'rainbow'],
  icon: '🪨',
  checkCondition: (ctx: AchievementContext) => {
    if (!ctx.puzzleSuccess) return false;
    return (ctx.puzzleAttempts ?? 0) >= 20;
  },
},
{
  id: 'puzzle-persistent',
  title: 'Persistent Prodigy',
  description: 'Finally clear a puzzle after 30+ attempts on the same puzzle',
  category: 'puzzle',
  modes: ['classic', 'rainbow'],
  icon: '🦾',
  checkCondition: (ctx: AchievementContext) => {
    if (!ctx.puzzleSuccess) return false;
    return (ctx.puzzleAttempts ?? 0) >= 30;
  },
},
];
