import { GameState, HighScore } from '@/types/game';

const CURRENT_GAME_KEY = 'yahtzee_current_game';
const HIGH_SCORES_KEY = 'yahtzee_high_scores';

// Database-ready service layer - replace localStorage with API calls later

export const gameService = {
  // Current game management
  getCurrentGame(): GameState | null {
    const data = localStorage.getItem(CURRENT_GAME_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveCurrentGame(gameState: GameState): void {
    gameState.updatedAt = new Date().toISOString();
    localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(gameState));
  },

  clearCurrentGame(): void {
    localStorage.removeItem(CURRENT_GAME_KEY);
  },

  // High scores management
  getHighScores(): HighScore[] {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveHighScore(score: HighScore): void {
    const scores = this.getHighScores();
    scores.push(score);
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
  },

  deleteHighScore(id: string): void {
    const scores = this.getHighScores().filter(s => s.id !== id);
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
  },

  clearHighScores(): void {
    localStorage.removeItem(HIGH_SCORES_KEY);
  },
};
