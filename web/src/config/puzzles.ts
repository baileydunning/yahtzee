import { Puzzle } from "@/types/puzzle";

export const PUZZLES: Puzzle[] = [
  // =====================
  // CLASSIC – EASY
  // =====================
  {
    id: "classic-easy-1",
    title: "Triple Play",
    description:
      "You have a promising start. Can you lock in a strong Three of a Kind?",
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
    description: "Two pairs are knocking—turn this start into a cozy, guaranteed Full House.",
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
    description:
      "Start strong with three sixes. Can you reach a big sixes score?",
    gameMode: "classic",
    difficulty: "easy",
    tags: ["upper_section", "beginner"],
    initialDice: [6, 6, 6, 3, 4],
    constraints: {
      requiredCategories: ["sixes"],
    },
    objective: {
      type: "category_minimum",
      value: 24,
      description: "Score at least 24 in Sixes (4+ sixes)",
    },
  },
  {
    id: "classic-easy-4",
    title: "Double Trouble",
    description:
      "You’re starting with two different pairs. Can you turn this into a solid Three of a Kind?",
    gameMode: "classic",
    difficulty: "easy",
    tags: ["three_of_kind", "beginner"],
    initialDice: [3, 3, 5, 5, 2],
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
    id: "classic-easy-6",
    title: "Five Alive",
    description:
      "You’ve got a strong start in fives. Can you push it to a big fives score?",
    gameMode: "classic",
    difficulty: "easy",
    tags: ["upper_section", "beginner", "fives"],
    initialDice: [5, 5, 5, 2, 3],
    constraints: {
      requiredCategories: ["fives"],
    },
    objective: {
      type: "category_minimum",
      value: 20,
      description: "Score at least 20 in Fives (4+ fives)",
    },
  },
  {
    id: "classic-easy-9",
    title: "Low & Go",
    description:
      "Start small, finish strong. Score in Aces and make a solid Chance total from this low roll.",
    gameMode: "classic",
    difficulty: "easy",
    tags: ["multi_category", "aces", "chance", "beginner"],
    initialDice: [1, 1, 2, 3, 3],
    constraints: {
      requiredCategories: ["aces", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 20,
      description: "Score in Aces and reach at least 20 total from Chance",
    },
  },
  {
    id: "classic-easy-10",
    title: "Fours on Deck",
    description: "Two fours are showing. Stack the deck and make Fours pay.",
    gameMode: "classic",
    difficulty: "easy",
    tags: ["upper_section", "fours", "beginner"],
    initialDice: [4, 4, 1, 2, 6],
    constraints: { requiredCategories: ["fours"] },
    objective: {
      type: "category_minimum",
      value: 16,
      description: "Score at least 16 in Fours (4+ fours)",
    },
  },

  // =====================
  // CLASSIC – MEDIUM
  // =====================
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
      description:
        "Score at least 45 points across Three of a Kind and Full House",
    },
  },
  {
    id: "classic-medium-4",
    title: "Chance Dance",
    description:
      "From a low roll of 1s, 2s, and 3s, can you turn this into a big Chance score?",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["chance", "push_your_luck"],
    initialDice: [1, 1, 2, 2, 3],
    constraints: {
      requiredCategories: ["chance"],
    },
    objective: {
      type: "category_minimum",
      value: 25,
      description: "Score at least 25 points in Chance",
    },
  },
  {
    id: "classic-medium-5",
    title: "Roll to Convert",
    description:
      "You start with a low triple. Can you convert this position into a strong Sixes score?",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["upper_section", "sixes", "strategy"],
    initialDice: [1, 1, 1, 4, 5],
    constraints: {
      requiredCategories: ["sixes"],
    },
    objective: {
      type: "category_minimum",
      value: 18,
      description: "Score at least 18 in Sixes (3+ sixes)",
    },
  },
  {
    id: "classic-medium-7",
    title: "Cross Scores",
    description:
      "Balance your rolls to score well in both Fours and Sixes.",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "upper_section"],
    initialDice: [4, 6, 1, 2, 4],
    constraints: {
      requiredCategories: ["fours", "sixes"],
    },
    objective: {
      type: "score_at_least",
      value: 32,
      description: "Score at least 32 total across Fours and Sixes",
    },
  },
  {
    id: "classic-medium-low-roller-legend",
    title: "Low Roller Legend",
    description:
      "No high faces allowed. Can you squeeze a big total out of only 1s, 2s, and 3s?",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "upper_section", "chance", "low_values"],
    initialDice: [1, 1, 2, 2, 3],
    constraints: {
      requiredCategories: ["aces", "twos", "threes", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 45,
      description:
        "Score at least 45 total across Aces, Twos, Threes, and Chance",
    },
  },
  {
    id: "classic-medium-bridge-builder",
    title: "Bridge Builder",
    description:
      "You’ve got the edges of a run. Build the bridge and lock the Small Straight.",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["small_straight", "routing", "fun"],
    initialDice: [1, 2, 4, 6, 6],
    constraints: {
      requiredCategories: ["smallStraight"],
    },
    objective: {
      type: "specific_category",
      value: "smallStraight",
      description: "Score a Small Straight (30 points)",
    },
  },
  {
    id: "classic-medium-triangle-route",
    title: "The Triangle Route",
    description:
      "Three paths diverge. Can you hit Chance, Full House, and a solid upper-section score?",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "full_house", "chance", "upper_section"],
    initialDice: [2, 2, 3, 3, 5],
    constraints: {
      requiredCategories: ["chance", "fullHouse", "fives"],
    },
    objective: {
      type: "score_at_least",
      value: 65,
      description: "Score 20+ in Chance, 20+ in fives and a Full House",
    },
  },
  {
    id: "classic-medium-pairs-to-stairs",
    title: "Pairs to Stairs",
    description:
      "You’re starting with two separate pairs. Can you climb your way into a Large Straight?",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["large_straight", "rhyming", "fun"],
    initialDice: [2, 2, 5, 5, 3],
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
    id: "classic-medium-threes-company",
    title: "Three's Company",
    description: "Starting from scratch, can you roll your way to a solid trio of threes?",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["upper_section", "threes", "routing"],
    initialDice: [],
    constraints: {
      requiredCategories: ["threes"],
    },
    objective: {
      type: "category_minimum",
      value: 9,
      description: "Score at least 9 in Threes (a trio of 3s or better)",
    },
  },
  {
    id: "classic-medium-exact-chance-27",
    title: "Chance is Perfect",
    description: "Push your luck, but stop at the right moment.",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["chance", "precision", "score_exactly"],
    initialDice: [],
    constraints: { requiredCategories: ["chance"] },
    objective: {
      type: "score_exactly",
      value: 27,
      description: "Score exactly 27 in Chance",
    },
  },

  // =====================
  // CLASSIC – HARD
  // =====================
  {
    id: "classic-hard-1",
    title: "Yahtzee Dream",
    description:
      "You have three of a kind. Can you push it all the way to Yahtzee?",
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
    id: "classic-medium-11",
    title: "Fork in the Road",
    description:
      "A clean pair and a tempting spread. Can you route this into value across three categories?",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "routing", "upper_section"],
    initialDice: [2, 2, 4, 5, 6],
    constraints: {
      requiredCategories: ["twos", "fours", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 40,
      description: "Score at least 40 total across Twos, Fours, and Chance",
    },
  },
  {
    id: "classic-medium-12",
    title: "Small Steps, Big Finish",
    description:
      "You’re one die away from a line. Secure the Small Straight, then cash out the leftovers in Chance.",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "small_straight", "chance"],
    initialDice: [1, 2, 3, 4, 6],
    constraints: {
      requiredCategories: ["smallStraight", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 52,
      description: "Score at least 52 total across Small Straight and Chance",
    },
  },
  {
    id: "classic-medium-13",
    title: "Full House Warm-Up",
    description:
      "Two pairs is a great start—turn it into a Full House and still get a respectable Chance.",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "full_house", "chance", "pairs"],
    initialDice: [3, 3, 5, 5, 1],
    constraints: {
      requiredCategories: ["fullHouse", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 50,
      description: "Score at least 50 total across Full House and Chance",
    },
  },
  {
    id: "classic-medium-14",
    title: "Steady Sixes",
    description:
      "A nice start, but not a guarantee. Build a solid Sixes score and back it up with a strong Three of a Kind.",
    gameMode: "classic",
    difficulty: "medium",
    tags: ["multi_category", "sixes", "three_of_kind", "strategy"],
    initialDice: [6, 6, 3, 4, 5],
    constraints: {
      requiredCategories: ["sixes", "threeOfKind"],
    },
    objective: {
      type: "score_at_least",
      value: 40,
      description: "Score at least 40 total across Sixes and Three of a Kind",
    },
  },
  {
    id: "classic-hard-four-kind-heavy",
    title: "Heavy Machinery",
    description:
      "You’re close to power. Build a Four of a Kind — but it has to be worth it.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["four_of_kind", "power", "category_minimum"],
    initialDice: [6, 6, 5, 2, 4],
    constraints: {
      requiredCategories: ["fourOfKind"],
    },
    objective: {
      type: "category_minimum",
      value: 26,
      description: "Score at least 26 in Four of a Kind",
    },
  },
  {
    id: "classic-hard-exact-42-split",
    title: "Split Decision",
    description: "Balance two categories without overshooting either.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "precision", "score_exactly"],
    initialDice: [],
    constraints: { requiredCategories: ["threeOfKind", "chance"] },
    objective: {
      type: "score_exactly",
      value: 42,
      description: "Score exactly 42 total across Three of a Kind and Chance",
    },
  },
  {
    id: "classic-hard-exact-upper-63",
    title: "Upper Tightrope",
    description: "You can earn the bonus… but only just.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["upper_section", "precision", "score_exactly"],
    initialDice: [],
    constraints: {
      requiredCategories: ["aces", "twos", "threes", "fours", "fives", "sixes"],
    },
    objective: {
      type: "score_exactly",
      value: 63,
      description: "Score exactly 63 across the entire Upper Section",
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
      value: 50,
      description: "Score at least 50 points across Small Straight and Chance",
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
  {
    id: "classic-hard-4",
    title: "Broken Straight",
    description:
      "Your straight is almost there, but broken in the middle. Can you repair it into a Large Straight?",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["large_straight", "puzzle"],
    initialDice: [1, 2, 4, 5, 5],
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
    id: "classic-multi-14",
    title: "Upper Weave",
    description:
      "Stitch the upper section together. Fives and Sixes both need to pull their weight.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "upper_section", "fives", "sixes"],
    initialDice: [5, 6, 6, 2, 4],
    constraints: {
      requiredCategories: ["fives", "sixes"],
    },
    objective: {
      type: "score_at_least",
      value: 38,
      description: "Score at least 38 total across Fives and Sixes",
    },
  },
  {
    id: "classic-hard-even-engine",
    title: "Even Engine",
    description:
      "Lean into the evens. Build power with 2s, 4s, 6s, and a big Four of a Kind.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "upper_section", "four_of_kind", "even_only"],
    initialDice: [2, 2, 4, 4, 6],
    constraints: {
      requiredCategories: ["twos", "fours", "sixes", "fourOfKind"],
    },
    objective: {
      type: "score_at_least",
      value: 60,
      description:
        "Score at least 60 total across Twos, Fours, Sixes, and Four of a Kind",
    },
  },
  {
    id: "classic-hard-odd-squad",
    title: "Odd Squad",
    description:
      "Odds only. Build your whole game plan around 1s, 3s, and 5s plus a strong Chance.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "upper_section", "chance", "odd_only"],
    initialDice: [1, 3, 3, 5, 5],
    constraints: {
      requiredCategories: ["aces", "threes", "fives", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 56,
      description:
        "Score at least 56 total across Aces, Threes, Fives, and Chance",
    },
  },
  {
    id: "classic-multi-16",
    title: "Crossroads",
    description:
      "Every roll feeds two masters. Balance structure and value without wasting pips.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "routing"],
    initialDice: [2, 3, 4, 4, 6],
    constraints: {
      requiredCategories: ["smallStraight", "fours", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 55,
      description:
        "Score at least 55 total across Small Straight, Fours, and Chance",
    },
  },
  {
    id: "classic-multi-22",
    title: "Low-High Exchange",
    description:
      "Sacrifice low-value categories to fuel high returns.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "aces", "chance", "four_of_kind"],
    initialDice: [1, 1, 5, 5, 6],
    constraints: {
      requiredCategories: ["aces", "fourOfKind", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 48,
      description:
        "Score at least 48 total across Aces, Four of a Kind, and Chance",
    },
  },
  {
    id: "classic-hard-straight-weight",
    title: "Straight & Weight",
    description:
      "Build the perfect line AND a heavy-hitting Four of a Kind. Can you balance precision and power?",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "large_straight", "four_of_kind"],
    initialDice: [1, 2, 3, 5, 5],
    constraints: {
      requiredCategories: ["largeStraight", "fourOfKind"],
    },
    objective: {
      type: "score_at_least",
      value: 24,
      description:
        "Score a Large Straight and at least 24 points in Four of a Kind",
    },
  },

  // =====================
  // CLASSIC – EXPERT
  // =====================
  {
    id: "classic-expert-1",
    title: "Sixes Showdown",
    description:
      "From a clean slate, roll your way to the ultimate goal: a Yahtzee of sixes. No hints, no training wheels.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["yahtzee", "sixes", "expert"],
    initialDice: [],
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
    id: "classic-expert-long-game",
    title: "The Long Game",
    description: "Build patiently. Your payoff comes late — if you survive.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "upper_section", "chance", "routing", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: ["aces", "twos", "threes", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 45,
      description: "Score at least 45 total across Aces, Twos, Threes, and Chance",
    },
  },
  {
    id: "classic-expert-tightrope-walk",
    title: "Tightrope Walk",
    description: "Every pip matters. Overshoot once and it’s over.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "upper_section", "precision", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: ["threes", "fours", "fives", "sixes"],
    },
    objective: {
      type: "score_exactly",
      value: 54,
      description: "Score exactly 54 total across Threes, Fours, Fives, and Sixes",
    },
  },
  {
    id: "classic-expert-2",
    title: "Bonus Run",
    description: "Play Aces through Sixes—reach the bonus threshold!",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["upper_section", "multi_category", "hard"],
    initialDice: [],
    constraints: {
      requiredCategories: ["aces", "twos", "threes", "fours", "fives", "sixes"],
    },
    objective: {
      type: "score_at_least",
      value: 63,
      description:
        "Score at least 63 total in the Upper Section (reach the upper bonus without scoring any zeroes)",
    },
  },
  {
    id: "classic-five-1",
    title: "Five-Way Junction",
    description:
      "Five paths diverge from the same roll. Choose carefully — every category competes for the same dice.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "routing", "five_categories", "expert"],
    initialDice: [2, 3, 3, 4, 5],
    constraints: {
      requiredCategories: [
        "smallStraight",
        "threeOfKind",
        "threes",
        "chance",
        "fours",
      ],
    },
    objective: {
      type: "score_at_least",
      value: 85,
      description:
        "Score at least 85 total across Small Straight, Three of a Kind, Threes, Fours, and Chance",
    },
  },
  {
    id: "classic-five-2",
    title: "Upper Section Gauntlet",
    description:
      "No shortcuts. You must earn value across the upper section while still finding flexibility at the end.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "upper_section", "chance", "five_categories", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: [
        "aces",
        "twos",
        "threes",
        "fours",
        "chance",
      ],
    },
    objective: {
      type: "score_at_least",
      value: 55,
      description:
        "Score at least 55 total across Aces, Twos, Threes, Fours, and Chance",
    },
  },
  {
    id: "classic-five-3",
    title: "Structure Under Pressure",
    description:
      "Every roll must serve multiple goals. Miss once, and the whole plan collapses.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "routing", "five_categories", "expert"],
    initialDice: [1, 2, 2, 3, 6],
    constraints: {
      requiredCategories: [
        "fullHouse",
        "smallStraight",
        "threeOfKind",
        "sixes",
        "chance",
      ],
    },
    objective: {
      type: "score_at_least",
      value: 92,
      description:
        "Score at least 92 total across Full House, Small Straight, Three of a Kind, Sixes, and Chance",
    },
  },
  {
    id: "classic-expert-exact-split-60",
    title: "Perfect Split",
    description:
      "Two categories. One exact total. The route is yours — the margin isn’t.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "precision", "score_exactly"],
    initialDice: [2, 2, 3, 5, 6],
    constraints: {
      requiredCategories: ["fourOfKind", "chance"],
    },
    objective: {
      type: "score_exactly",
      value: 60,
      description: "Score exactly 60 total across Four of a Kind and Chance",
    },
  },
  {
    id: "classic-expert-3",
    title: "Chaos Routing",
    description:
      "No preset dice and four required categories. Can you route your way through this chaotic run?",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "routing", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: [
        "smallStraight",
        "fullHouse",
        "threeOfKind",
        "chance",
      ],
    },
    objective: {
      type: "multiple_categories",
      value: ["smallStraight", "fullHouse", "threeOfKind", "chance"],
      description:
        "Score in Small Straight, Full House, Three of a Kind, and Chance",
    },
  },
  {
    id: "classic-expert-exact-hit",
    title: "Exact Hit",
    description:
      "Precision over power. Can you land the perfect combined total across Ones, Three of a Kind and Chance?",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "three_of_kind", "chance", "precision"],
    initialDice: [2, 3, 3, 4, 5],
    constraints: {
      requiredCategories: ["aces", "threeOfKind", "chance"],
    },
    objective: {
      type: "score_exactly",
      value: 42,
      description:
        "Finish with exactly 42 points combined across Three of a Kind and Chance",
    },
  },
  {
    id: "classic-eight-1",
    title: "The Octagon",
    description:
      "Eight demands. One scorecard. Every decision echoes through the rest of the run.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "routing", "eight_categories", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: [
        "aces",
        "threes",
        "fours",
        "sixes",
        "threeOfKind",
        "fullHouse",
        "smallStraight",
        "chance",
      ],
    },
    objective: {
      type: "score_at_least",
      value: 140,
      description:
        "Score at least 140 total across all 8 required categories",
    },
  },
  {
    id: "classic-expert-straightjacket",
    title: "Straightjacket",
    description: "The line constrains everything else.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "large_straight", "chance", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: ["largeStraight", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 65,
      description: "Score at least 65 total across Large Straight and Chance",
    },
  },
  {
    id: "classic-multi-24",
    title: "Structured Chaos",
    description:
      "Five demands, one roll at a time.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "five_categories", "expert"],
    initialDice: [2, 3, 4, 5, 6],
    constraints: {
      requiredCategories: [
        "smallStraight",
        "largeStraight",
        "threeOfKind",
        "fives",
        "chance",
      ],
    },
    objective: {
      type: "score_at_least",
      value: 115,
      description:
        "Score at least 115 total across all required categories",
    },
  },
  {
    id: "classic-expert-the-gauntlet",
    title: "The Gauntlet",
    description:
      "No freebies, no overlap. Every category pulls in a different direction.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "routing", "upper_section", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: [
        "threes",
        "sixes",
        "smallStraight",
        "fourOfKind",
      ],
    },
    objective: {
      type: "score_at_least",
      value: 80,
      description:
        "Score at least 80 total across Threes, Sixes, Small Straight, and Four of a Kind",
    },
  },
  {
    id: "classic-expert-precision-under-fire",
    title: "Precision Under Fire",
    description:
      "Four categories. Tight margins. One mistake ruins the plan.",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "precision", "chance", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: [
        "fours",
        "fives",
        "fullHouse",
        "chance",
      ],
    },
    objective: {
      type: "score_at_least",
      value: 72,
      description:
        "Score at least 72 total across Fours, Fives, Full House, and Chance",
    },
  },

  // =========================
  // CLASSIC – MULTI-CATEGORY
  // =========================
  {
    id: "classic-multi-1",
    title: "Double Lines",
    description:
      "Score in Small Straight AND Large Straight with a strong total.",
    gameMode: "classic",
    difficulty: "hard",
    tags: ["multi_category", "straights"],
    initialDice: [],
    constraints: {
      requiredCategories: ["smallStraight", "largeStraight"],
    },
    objective: {
      type: "score_exactly",
      value: 70,
      description:
        "Score 70 points across Small Straight and Large Straight",
    },
  },
  {
    id: "classic-multi-2",
    title: "Triple Feat",
    description: "Score Small Straight, Large Straight, AND a Yahtzee!",
    gameMode: "classic",
    difficulty: "expert",
    tags: ["multi_category", "expert"],
    initialDice: [],
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
    initialDice: [],
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
      value: 66,
      description:
        "Score at least 66 total across Three of a Kind, Four of a Kind, and Chance",
    },
  },

  // =====================
  // RAINBOW – EASY
  // =====================
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
    description: "You're close. Make every die blue!",
    gameMode: "rainbow",
    difficulty: "easy",
    tags: ["all_color", "beginner"],
    initialDice: [2, 3, 4, 5, 6],
    initialColors: ["blue", "blue", "blue", "green", "blue"],
    constraints: {
      requiredCategories: ["allBlue"],
    },
    objective: {
      type: "color_objective",
      value: "allBlue",
      description: "Score All Blue",
    },
  },

  // =====================
  // RAINBOW – MEDIUM
  // =====================
  {
    id: "rainbow-medium-1",
    title: "Purple Board",
    description: "Make every die purple!",
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
    title: "Ruby Rally",
    description: "Unleash a wave of red—turn every die scarlet and roll a powerful Three of a Kind. Only true color and number mastery will earn you a dazzling score!",
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
      description:
        "Score at least 65 total across All Red and Three of a Kind",
    },
  },
  {
    id: "rainbow-medium-blue-river",
    title: "Blue River",
    description:
      "Guide your dice down the river—form a Large Straight and transform the board into a sea of blue. Can you master both the line and the color?",
    gameMode: "rainbow",
    difficulty: "medium",
    tags: ["all_color", "large_straight", "intermediate"],
    initialDice: [2, 3, 4, 5, 4],
    initialColors: ["blue", "blue", "red", "yellow", "blue"],
    constraints: {
      requiredCategories: ["allBlue", "largeStraight"],
    },
    objective: {
      type: "score_exactly",
      value: 90,
      description: "Score Large Straight (40) and reach 50+ from All Blue",
    },
  },
  {
    id: "rainbow-medium-mono-madness",
    title: "Mono Madness",
    description: "Start with a single-color board and break it into four unique colors.",
    gameMode: "rainbow",
    difficulty: "medium",
    tags: ["color_mix", "routing", "fourColorMix"],
    initialDice: [2, 4, 3, 5, 1],
    initialColors: ["red", "red", "red", "red", "red"],
    constraints: {
      requiredCategories: ["fourColorMix"],
    },
    objective: {
      type: "color_objective",
      value: "fourColorMix",
      description: "Score Four-Color Mix (exactly 4 different colors)",
    },
  },
  {
    id: "rainbow-medium-8",
    title: "Final Color",
    description: "A near-rainbow roll—can you perfect it?",
    gameMode: "rainbow",
    difficulty: "medium",
    tags: ["rainbow", "medium"],
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

  // =====================
  // RAINBOW – HARD
  // =====================
  {
    id: "rainbow-hard-1",
    title: "Green Board",
    description: "You have a couple greens—push it all the way!",
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
    id: "rainbow-hard-low-spectrum-42",
    title: "Low Spectrum",
    description:
      "Small numbers, limited colors, zero margin for error.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["precision", "low_values", "threeColorMix", "score_exactly"],
    initialDice: [],
    constraints: {
      requiredCategories: [
        "aces",
        "twos",
        "threes",
        "chance",
        "threeColorMix",
      ],
    },
    objective: {
      type: "score_exactly",
      value: 42,
      description:
        "Score exactly 42 total across Aces, Twos, Threes, Chance, and Three-Color Mix",
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
      type: "score_exactly",
      value: 50,
      description: "Score exactly 50 from Rainbow Bonus",
    },
  },
  {
    id: "rainbow-hard-santas-choice",
    title: "Santa's Choice",
    description:
      "Red or green? No—both! Deliver a festive spread with color mastery and a strong Chance score.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["multi_category", "all_color", "chance"],
    initialDice: [1, 1, 1, 1, 1],
    initialColors: ["red", "green", "red", "green", "red"],
    constraints: {
      requiredCategories: ["allRed", "allGreen", "chance"],
    },
    objective: {
      type: "score_at_least",
      value: 110,
      description: "Score All Red, All Green, and at least 10 in Chance",
    },
  },
  {
    id: "rainbow-hard-exact-mix-chance-82",
    title: "Spectrum Control",
    description: "Balance color variety with numerical restraint. Score exactly 70 points across Three-Color Mix, Four-Color Mix, and Chance.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["multi_category", "precision", "score_exactly"],
    initialDice: [],
    constraints: { requiredCategories: ["threeColorMix", "fourColorMix", "chance"] },
    objective: {
      type: "score_exactly",
      value: 70,
      description: "Score exactly 70 across Three-Color Mix, Four-Color Mix, and Chance",
    },
  },
  {
    id: "rainbow-hard-purple-reign",
    title: "Purple Reign",
    description:
      "Hit the Upper Bonus while also scoring All Purple. Number precision meets color mastery.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["multi_category", "upper_section", "all_color", "strategy"],
    initialDice: [],
    constraints: {
      requiredCategories: [
        "aces",
        "twos",
        "threes",
        "fours",
        "fives",
        "sixes",
        "allPurple",
      ],
    },
    objective: {
      type: "score_at_least",
      value: 113,
      description:
        "Reach the Upper Bonus (63+) AND score all Purple (50 points)",
    },
  },
  {
    id: "rainbow-hard-color-cascade",
    title: "Color Cascade",
    description:
      "A freeform challenge. Build a cascade of color categories however you choose.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["multi_category", "rainbow"],
    initialDice: [],
    constraints: {
      requiredCategories: [
        "smallStraight",
        "chance",
        "threeColorMix",
        "fourColorMix",
        "rainbowBonus",
      ],
    },
    objective: {
      type: "score_at_least",
      value: 150,
      description: "Score at least 150 total across the required categories",
    },
  },
  {
    id: "rainbow-hard-green-with-envy",
    title: "Green With Envy",
    description:
      "Big numbers are tempting—but everything must stay green.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["multi_category", "four_of_kind", "all_color"],
    initialDice: [],
    constraints: {
      requiredCategories: ["fourOfKind", "chance", "allGreen"],
    },
    objective: {
      type: "score_at_least",
      value: 95,
      description:
        "Score at least 95 total across Four of a Kind, Chance, and All Green",
    },
  },
  {
    id: "rainbow-hard-exact-red-chance-79",
    title: "Monochrome Discipline",
    description: "One color, one flexible outlet. No mistakes.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["all_color", "chance", "precision", "score_exactly"],
    initialDice: [],
    constraints: { requiredCategories: ["allRed", "chance"] },
    objective: {
      type: "score_exactly",
      value: 70,
      description: "Score exactly 70 across All Red and Chance",
    },
  },
  {
    id: "rainbow-hard-red-thread",
    title: "Red Thread",
    description:
      "One color weaves through everything. Don’t lose the pattern.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["multi_category", "routing", "all_color"],
    initialDice: [],
    constraints: {
      requiredCategories: ["threeOfKind", "chance", "allRed"],
    },
    objective: {
      type: "score_at_least",
      value: 95,
      description:
        "Score at least 95 total across Three of a Kind, Chance, and All Red",
    },
  },
  {
    id: "rainbow-hard-purple-pressure",
    title: "Purple Pressure",
    description:
      "Structure fights instinct. Purple decides everything.",
    gameMode: "rainbow",
    difficulty: "hard",
    tags: ["multi_category", "full_house", "chance", "all_color"],
    initialDice: [],
    constraints: {
      requiredCategories: ["fullHouse", "chance", "allPurple"],
    },
    objective: {
      type: "score_at_least",
      value: 95,
      description:
        "Score at least 95 total across Full House, Chance, and All Purple",
    },
  },
  {
    id: "rainbow-expert-chromatic-backbone",
    title: "Chromatic Backbone",
    description:
      "A straight spine, reinforced by color discipline.",
    gameMode: "rainbow",
    difficulty: "expert",
    tags: ["multi_category", "large_straight", "all_color", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: ["largeStraight", "smallStraight", "allGreen"],
    },
    objective: {
      type: "score_at_least",
      value: 120,
      description:
        "Score at least 120 total across Large Straight, Small Straight, and All Green",
    },
  },

  // =====================
  // RAINBOW – EXPERT
  // =====================
  {
    id: "rainbow-expert-2",
    title: "Spectrum Trial",
    description: "Hit 3-Color Mix, 4-Color Mix, and Rainbow Bonus in one run.",
    gameMode: "rainbow",
    difficulty: "expert",
    tags: ["multi_category", "color_mix", "rainbow", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: ["threeColorMix", "fourColorMix", "rainbowBonus"],
    },
    objective: {
      type: "multiple_categories",
      value: ["threeColorMix", "fourColorMix", "rainbowBonus"],
      description: "Score 3-Color Mix, 4-Color Mix, and Rainbow Bonus",
    },
  },
  {
    id: "rainbow-expert-painted-numbers",
    title: "Painted Numbers",
    description:
      "Numbers want freedom. Color demands control. Can you satisfy both without breaking either?",
    gameMode: "rainbow",
    difficulty: "expert",
    tags: ["multi_category", "routing", "all_color", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: ["threeOfKind", "largeStraight", "allBlue"],
    },
    objective: {
      type: "score_at_least",
      value: 110,
      description:
        "Score at least 110 total across Three of a Kind, Large Straight, and All Blue",
    },
  },
  {
    id: "rainbow-expert-the-blue-ceiling",
    title: "The Blue Ceiling",
    description:
      "Big scores are possible—but the color cap is unforgiving.",
    gameMode: "rainbow",
    difficulty: "expert",
    tags: ["multi_category", "upper_section", "chance", "all_color", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: ["fours", "sixes", "chance", "allBlue"],
    },
    objective: {
      type: "score_at_least",
      value: 110,
      description:
        "Score at least 110 total across Fours, Sixes, Chance, and All Blue",
    },
  },
  {
    id: "rainbow-expert-violet-endgame",
    title: "Violet Endgame",
    description:
      "Late-game precision under total color control.",
    gameMode: "rainbow",
    difficulty: "expert",
    tags: ["multi_category", "precision", "chance", "all_color", "expert"],
    initialDice: [],
    constraints: {
      requiredCategories: ["chance", "threeOfKind", "allPurple"],
    },
    objective: {
      type: "score_exactly",
      value: 92,
      description:
        "Score exactly 92 total across Chance, Three of a Kind, and All Purple",
    },
  },

  // =========================
  // RAINBOW – MULTI-CATEGORY
  // =========================
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
    initialDice: [],
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
    initialDice: [],
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
      description:
        "Score at least 70 total across All Green and Four of a Kind",
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
