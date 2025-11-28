import { GameMode, DiceColor } from './game';

export type PuzzleDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type PuzzleObjectiveType =
  | 'score_at_least'           // Sum of required categories must reach at least X
  | 'specific_category'        // Score > 0 in a specific category
  | 'category_minimum'         // Score at least X in a specific category
  | 'multiple_categories'      // Score > 0 in all listed categories
  | 'color_objective';         // Rainbow-specific color objective (allRed, rainbowBonus, etc.)

export interface PuzzleConstraints {
  /**
   * Indices of dice [0–4] that are locked and cannot be rerolled.
   * Used for some classic-mode “locked dice” challenges.
   * Ignored in most puzzles and should not be used for Rainbow mode.
   */
  lockedDiceIndices?: number[];

  /**
   * Categories that must be scored to complete the puzzle.
   * - If omitted, default is [objective.value] for single-category puzzles.
   * - For multi-category puzzles, this array must contain all required IDs.
   */
  requiredCategories?: string[];

  /**
   * Categories that are not allowed to be scored in this puzzle.
   * (Reserved for future use; safe to omit in current puzzles.)
   */
  forbiddenCategories?: string[];
}

export interface PuzzleObjective {
  type: PuzzleObjectiveType;

  // Depends on type:
  // - 'specific_category'      -> string (category id)
  // - 'category_minimum'       -> number (min score in the target category)
  // - 'score_at_least'         -> number (min total across requiredCategories)
  // - 'multiple_categories'    -> string[] (list of required category ids)
  // - 'color_objective'        -> string or string[] (color-based category ids)
  value: number | string | string[];

  // Human-readable description shown in UI (what the player should try to do)
  description: string;
}

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  gameMode: GameMode;
  difficulty: PuzzleDifficulty;
  tags: string[];

  // Initial state
  // Always present; use [] for “no preset start” so logic can safely assume an array.
  initialDice: number[];
  initialColors?: DiceColor[]; // For rainbow mode only; omitted for classic.

  // Constraints and special rules for this puzzle
  constraints: PuzzleConstraints;

  // Win condition
  objective: PuzzleObjective;
}

export interface PuzzleProgress {
  puzzleId: string;
  isCompleted: boolean;
  bestScore: number | null;
  attempts: number;
  completedAt?: string;
}

export interface PuzzleState {
  puzzle: Puzzle;
  currentDice: number[];
  currentColors: (DiceColor | 'neutral')[];
  heldDice: boolean[];

  // Total rolls used this turn (0–3).
  // Actual max rolls per turn is enforced by the PuzzleGame component, not per-puzzle.
  rollsUsed: number;

  hasRolled: boolean;
  selectedCategory: string | null;
  finalScore: number | null;
  isComplete: boolean;
  isSuccess: boolean | null;
}

export type PuzzleFilterMode = 'all' | 'classic' | 'rainbow';
export type PuzzleSortOption = 'difficulty' | 'completion' | 'title';
