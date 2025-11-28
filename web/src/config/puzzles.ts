import { Puzzle } from "@/types/puzzle";

export const PUZZLES: Puzzle[] = [
  // ============ CLASSIC MODE PUZZLES (15) ============

  // Easy Classic
  {
    id: "classic-easy-1",
    title: "Triple Play",
    description: "You have a promising start. Can you lock in a strong Three of a Kind?",
    gameMode: "classic",
    difficulty: "easy",
    tags: ["three_of_kind", "beginner"],
    initialDice: [3, 3, 2, 5, 6],
    constraints: {
      requiredCategories: ["threeOfKind"],
    },
    objective: {
      type: "specific_category",
      value: "threeOfKind",
      description: "Score in Three of a Kind (no zeros!)",
    },
  },
  {
    id: "classic-easy-2",
    title: "House Party",
    description: "You're close to a Full House. Can you finish the job?",
    gameMode: "classic",
    difficulty: "easy",
    tags: ["full_house", "beginner"],
    initialDice: [4, 4, 6, 6, 2],
    constraints: {
      requiredCategories: ["fullHouse"],
    },
    objective: {
      type: "specific_category",
      value: "fullHouse",
      description: "Score a Full House (25 points)",
    },
  },
  {
    id: "classic-easy-3",
    title: "Six Fix",
    description: "Start strong with two sixes. Can you reach a big Sixes score?",
    gameMode: "classic",
    difficulty: "easy",
    tags: ["upper_section", "beginner"],
    initialDice: [6, 6, 1, 3, 4],
    constraints: {
      requiredCategories: ["sixes"],
    },
    objective: {
      type: "category_minimum",
      value: 24,
      description: "Score at least 24 in Sixes (4+ sixes)",
    },
  },

  // Medium Classic
  {
    id: "classic-medium-1",
    title: "Almost Straight",
    description: "You’re almost there—can you finish the Large Straight?",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["large_straight"],
    initialDice: [1, 2, 3, 4, 4],
    constraints: {
      requiredCategories: ["largeStraight"],
    },
    objective: {
      type: "specific_category",
      value: "largeStraight",
      description: "Score a Large Straight (40 points)",
    },
  },
  {
    id: "classic-medium-3",
    title: "Kind of a Full House",
    description:
      "Score BOTH Three of a Kind and Full House for a solid combined score.",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "three_of_kind", "full_house"],
    initialDice: [],
    constraints: {
      requiredCategories: ["threeOfKind", "fullHouse"],
    },
    objective: {
      type: "score_at_least",
      value: 45,
      description: "Score at least 45 points across Three of a Kind and Full House",
    },
  },

  // Hard Classic
  {
    id: "classic-hard-1",
    title: "Yahtzee Dream",
    description: "You have three of a kind. Can you push it all the way to Yahtzee?",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["yahtzee", "high_risk"],
    initialDice: [2, 2, 2, 4, 6],
    constraints: {
      requiredCategories: ["yahtzee"],
    },
    objective: {
      type: "specific_category",
      value: "yahtzee",
      description: "Score a Yahtzee (50 points)",
    },
  },
  {
    id: "classic-hard-2",
    title: "Line & Luck",
    description:
      "Score in Small Straight AND Chance. Aim for a strong combined score.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "small_straight", "chance"],
    initialDice: [1, 2, 5, 5, 6],
    constraints: {
      requiredCategories: ["smallStraight", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 60,
      description: "Score at least 60 points across Small Straight and Chance",
    },
  },
  {
    id: "classic-hard-3",
    title: "Split Path",
    description:
      "Score both Three of a Kind AND a Small Straight. Requires smart routing.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "three_of_kind", "small_straight"],
    initialDice: [],
    constraints: {
      requiredCategories: ["threeOfKind", "smallStraight"],
    },
    objective: {
      type: "multiple_categories",
      value: ["threeOfKind", "smallStraight"],
      description: "Score both Three of a Kind and Small Straight",
    },
  },

  // Expert Classic
  {
    id: "classic-expert-1",
    title: "Sixes Showdown",
    description:
      "From a clean slate, roll your way to the ultimate goal: a Yahtzee of sixes. No hints, no training wheels.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["yahtzee", "sixes", "expert"],
    initialDice: [], // no preset dice
    constraints: {
      requiredCategories: ["yahtzee"],
    },
    objective: {
      type: "specific_category",
      value: "yahtzee",
      description: "Score a Yahtzee of sixes",
    },
  },
  {
    id: "classic-expert-2",
    title: "Bonus Run",
    description: "Play Aces through Sixes—reach the bonus threshold!",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["upper_section", "multi_category", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: ["aces", "twos", "threes", "fours", "fives", "sixes"],
    },
    objective: {
      type: "score_at_least",
      value: 70,
      description: "Score at least 70 total in the Upper Section (reach the upper bonus)",
    },
  },

  // Multi-category Classic
  {
    id: "classic-multi-1",
    title: "Double Lines",
    description: "Score in Small Straight AND Large Straight with a strong total.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "straights"],
    initialDice: [],
    constraints: {
      requiredCategories: ["smallStraight", "largeStraight"],
    },
    objective: {
      type: "score_at_least",
      value: 70,
      description: "Score at least 70 points across Small Straight and Large Straight",
    },
  },
  {
    id: "classic-multi-2",
    title: "Triple Feat",
    description: "Score Small Straight, Large Straight, AND a Yahtzee!",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "expert"],
    initialDice: [2, 3, 4, 5, 5],
    constraints: {
      requiredCategories: ["largeStraight", "smallStraight", "yahtzee"],
    },
    objective: {
      type: "multiple_categories",
      value: ["largeStraight", "smallStraight", "yahtzee"],
      description: "Score Large Straight, Small Straight, and Yahtzee",
    },
  },
  {
    id: "classic-multi-3",
    title: "House & Line",
    description: "Build a Full House AND a Small Straight.",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "intermediate"],
    initialDice: [3, 3, 3, 4, 5],
    constraints: {
      requiredCategories: ["fullHouse", "smallStraight"],
    },
    objective: {
      type: "multiple_categories",
      value: ["fullHouse", "smallStraight"],
      description: "Score a Full House and a Small Straight",
    },
  },
  {
    id: "classic-multi-4",
    title: "Kind Collector",
    description: "Score both Three of a Kind and Four of a Kind.",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "of_a_kind"],
    initialDice: [4, 4, 4, 2, 1],
    constraints: {
      requiredCategories: ["threeOfKind", "fourOfKind"],
    },
    objective: {
      type: "multiple_categories",
      value: ["threeOfKind", "fourOfKind"],
      description: "Score both Three of a Kind and Four of a Kind",
    },
  },
  {
    id: "classic-multi-5",
    title: "Big Value Trio",
    description:
      "Score in Three of a Kind, Four of a Kind, and Chance—reach a strong total.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "of_a_kind", "chance"],
    initialDice: [3, 3, 4, 4, 5],
    constraints: {
      requiredCategories: ["threeOfKind", "fourOfKind", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 80,
      description:
        "Score at least 80 total across Three of a Kind, Four of a Kind, and Chance",
    },
  },

  // ============ RAINBOW MODE PUZZLES (15) ============

  // Easy Rainbow
  {
    id: "rainbow-easy-1",
    title: "Red Board",
    description: "You have four red dice. Can you finish the job?",
    gameMode: "rainbow",
    difficulty: "easy",
    tags: ["all_color", "beginner"],
    initialDice: [3, 5, 2, 4, 1],
    initialColors: ["red", "red", "red", "blue", "red"],
    constraints: {
      requiredCategories: ["allRed"],
    },
    objective: {
      type: "color_objective",
      value: "allRed",
      description: "Score All Red (50 points)",
    },
  },
  {
    id: "rainbow-easy-2",
    title: "Full Spectrum",
    description: "You're one color away. Finish the full rainbow!",
    gameMode: "rainbow",
    difficulty: "easy",
    tags: ["rainbow", "beginner"],
    initialDice: [1, 2, 3, 4, 5],
    initialColors: ["red", "blue", "green", "yellow", "yellow"],
    constraints: {
      requiredCategories: ["rainbowBonus"],
    },
    objective: {
      type: "color_objective",
      value: "rainbowBonus",
      description: "Score the Rainbow Bonus (all 5 colors)",
    },
  },
  {
    id: "rainbow-easy-3",
    title: "Color Trio",
    description: "Get exactly three different colors.",
    gameMode: "rainbow",
    difficulty: "easy",
    tags: ["color_mix", "beginner"],
    initialDice: [2, 4, 6, 1, 3],
    initialColors: ["blue", "blue", "blue", "blue", "blue"],
    constraints: {
      requiredCategories: ["threeColorMix"],
    },
    objective: {
      type: "color_objective",
      value: "threeColorMix",
      description: "Score Three-Color Mix (exactly 3 colors)",
    },
  },
  {
    id: "rainbow-easy-4",
    title: "Blue Board",
    description: "Make every die blue!",
    gameMode: "rainbow",
    difficulty: "easy",
    tags: ["all_color", "beginner"],
    initialDice: [2, 3, 4, 5, 6],
    initialColors: ["blue", "blue", "blue", "green", "yellow"],
    constraints: {
      requiredCategories: ["allBlue"],
    },
    objective: {
      type: "color_objective",
      value: "allBlue",
      description: "Score All Blue",
    },
  },

  // Medium Rainbow
  {
    id: "rainbow-medium-1",
    title: "Purple Board",
    description: "You're close. Make every die purple!",
    gameMode: "rainbow",
    difficulty: "medium",
    tags: ["all_color"],
    initialDice: [4, 4, 2, 5, 3],
    initialColors: ["purple", "purple", "purple", "red", "blue"],
    constraints: {
      requiredCategories: ["allPurple"],
    },
    objective: {
      type: "color_objective",
      value: "allPurple",
      description: "Score All Purple",
    },
  },
  {
    id: "rainbow-medium-2",
    title: "Color Quartet",
    description: "Get exactly four different colors from scratch.",
    gameMode: "rainbow",
    difficulty: "medium",
    tags: ["color_mix", "intermediate"],
    initialDice: [],
    constraints: {
      requiredCategories: ["fourColorMix"],
    },
    objective: {
      type: "color_objective",
      value: "fourColorMix",
      description: "Score Four-Color Mix (exactly 4 colors)",
    },
  },
  {
    id: "rainbow-medium-3",
    title: "Red & Triple",
    description: "Score both All Red AND a solid Three of a Kind.",
    gameMode: "rainbow",
    difficulty: "medium",
    tags: ["multi_category", "all_color", "three_of_kind"],
    initialDice: [],
    constraints: {
      requiredCategories: ["allRed", "threeOfKind"],
    },
    objective: {
      type: "score_at_least",
      value: 65,
      description: "Score at least 65 total across All Red and Three of a Kind",
    },
  },

  // Hard Rainbow
  {
    id: "rainbow-hard-1",
    title: "Green Board",
    description: "You have a few greens—push it all the way!",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["all_color"],
    initialDice: [3, 3, 5, 2, 4],
    initialColors: ["green", "green", "red", "blue", "yellow"],
    constraints: {
      requiredCategories: ["allGreen"],
    },
    objective: {
      type: "color_objective",
      value: "allGreen",
      description: "Score All Green",
    },
  },
  {
    id: "rainbow-hard-2",
    title: "Rainbow Rush",
    description: "Build a full rainbow quickly from a blank start.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["rainbow"],
    initialDice: [],
    constraints: {
      requiredCategories: ["rainbowBonus"],
    },
    objective: {
      type: "score_at_least",
      value: 40,
      description: "Score at least 40 from Rainbow Bonus and supporting dice",
    },
  },

  // Expert Rainbow
  {
    id: "rainbow-expert-1",
    title: "Final Color",
    description: "A near-rainbow roll—can you perfect it?",
    gameMode: "rainbow",
    difficulty: "expert",
    tags: ["rainbow", "expert"],
    initialDice: [1, 2, 3, 4, 5],
    initialColors: ["red", "blue", "green", "green", "green"],
    constraints: {
      requiredCategories: ["rainbowBonus"],
    },
    objective: {
      type: "color_objective",
      value: "rainbowBonus",
      description: "Score Rainbow Bonus from this setup",
    },
  },
  {
    id: "rainbow-expert-2",
    title: "Spectrum Trial",
    description: "Hit 3-Color Mix, 4-Color Mix, and Rainbow Bonus in one run.",
    gameMode: "rainbow",
    difficulty: "expert",
    tags: ["multi_category", "color_mix", "rainbow", "expert"],
    initialDice: [1, 2, 3, 4, 5],
    initialColors: ["red", "blue", "green", "green", "purple"],
    constraints: {
      requiredCategories: ["threeColorMix", "fourColorMix", "rainbowBonus"],
    },
    objective: {
      type: "multiple_categories",
      value: ["threeColorMix", "fourColorMix", "rainbowBonus"],
      description: "Score 3-Color Mix, 4-Color Mix, and Rainbow Bonus",
    },
  },

  // Multi-category Rainbow
  {
    id: "rainbow-multi-1",
    title: "Red & Blue",
    description: "Score both All Red AND All Blue!",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["multi_category", "all_color"],
    initialDice: [2, 4, 6, 1, 3],
    initialColors: ["red", "red", "blue", "blue", "green"],
    constraints: {
      requiredCategories: ["allRed", "allBlue"],
    },
    objective: {
      type: "multiple_categories",
      value: ["allRed", "allBlue"],
      description: "Score both All Red and All Blue",
    },
  },
  {
    id: "rainbow-multi-2",
    title: "Rainbow Royale",
    description: "Color mastery AND number mastery in one puzzle.",
    gameMode: "rainbow",
    difficulty: "expert",
    tags: ["multi_category", "rainbow", "yahtzee"],
    initialDice: [3, 3, 3, 4, 5],
    initialColors: ["red", "blue", "green", "yellow", "purple"],
    constraints: {
      requiredCategories: ["rainbowBonus", "yahtzee"],
    },
    objective: {
      type: "multiple_categories",
      value: ["rainbowBonus", "yahtzee"],
      description: "Score Rainbow Bonus and Yahtzee",
    },
  },
  {
    id: "rainbow-multi-3",
    title: "Color Combo",
    description: "Score both 3-Color Mix and 4-Color Mix.",
    gameMode: "rainbow",
    difficulty: "medium",
    tags: ["multi_category", "color_mix"],
    initialDice: [1, 2, 3, 4, 5],
    initialColors: ["red", "blue", "green", "green", "blue"],
    constraints: {
      requiredCategories: ["threeColorMix", "fourColorMix"],
    },
    objective: {
      type: "multiple_categories",
      value: ["threeColorMix", "fourColorMix"],
      description: "Score both 3-Color Mix and 4-Color Mix",
    },
  },
  {
    id: "rainbow-multi-4",
    title: "Green & Kind",
    description: "Combine color perfection with strong number scoring.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["multi_category", "all_color", "four_of_kind"],
    initialDice: [3, 3, 3, 5, 6],
    initialColors: ["green", "green", "green", "red", "blue"],
    constraints: {
      requiredCategories: ["allGreen", "fourOfKind"],
    },
    objective: {
      type: "score_at_least",
      value: 70,
      description: "Score at least 70 total across All Green and Four of a Kind",
    },
  },
];

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800 border-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "hard":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "expert":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getDifficultyOrder = (difficulty: string): number => {
  switch (difficulty) {
    case "easy":
      return 1;
    case "medium":
      return 2;
    case "hard":
      return 3;
    case "expert":
      return 4;
    default:
      return 5;
  }
};
