
import { PuzzleProgress } from '@/types/puzzle';

const PUZZLE_PROGRESS_KEY = 'yahtzee_puzzle_progress';

export const puzzleService = {
  // Get all puzzle progress
  getAllProgress(): Record<string, PuzzleProgress> {
    const data = localStorage.getItem(PUZZLE_PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  },

  // Get progress for a specific puzzle
  getProgress(puzzleId: string): PuzzleProgress | null {
    const allProgress = this.getAllProgress();
    return allProgress[puzzleId] || null;
  },

  // Update progress after completing a puzzle
  updateProgress(puzzleId: string, score: number, success: boolean): PuzzleProgress {
    const allProgress = this.getAllProgress();
    const existing = allProgress[puzzleId];

    const updated: PuzzleProgress = {
      puzzleId,
      isCompleted: existing?.isCompleted || success,
      bestScore: existing?.bestScore 
        ? Math.max(existing.bestScore, score) 
        : score,
      attempts: (existing?.attempts || 0) + 1,
      completedAt: success ? new Date().toISOString() : existing?.completedAt,
    };

    allProgress[puzzleId] = updated;
    localStorage.setItem(PUZZLE_PROGRESS_KEY, JSON.stringify(allProgress));
    
    return updated;
  },

  // Get completion stats
  getStats(): { completed: number; total: number; classicCompleted: number; rainbowCompleted: number } {
    const allProgress = this.getAllProgress();
    const progressValues = Object.values(allProgress) as PuzzleProgress[];
    const completedPuzzles = progressValues.filter(p => p.isCompleted);
    
    // We'll need to cross-reference with puzzles to get mode-specific stats
    // For now, return basic stats
    return {
      completed: completedPuzzles.length,
      total: Object.keys(allProgress).length,
      classicCompleted: 0, // Will be calculated in component
      rainbowCompleted: 0, // Will be calculated in component
    };
  },

  // Clear all progress
  clearAllProgress(): void {
    localStorage.removeItem(PUZZLE_PROGRESS_KEY);
  },

  // Reset progress for a specific puzzle
  resetProgress(puzzleId: string): void {
    const allProgress = this.getAllProgress();
    delete allProgress[puzzleId];
    localStorage.setItem(PUZZLE_PROGRESS_KEY, JSON.stringify(allProgress));
  },
};
