import { GameState, HighScore } from '@/types/game';

const CURRENT_GAME_KEY = 'yahtzee_current_game';

export const gameService = {
  // -----------------------------
  // Current game (localStorage)
  // -----------------------------
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

  // -----------------------------
  // High Scores (Harper only)
  // -----------------------------

  async getHighScores(): Promise<HighScore[]> {
    const res = await fetch('/HighScores', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to fetch high scores: ${res.status} ${text}`);
    }

    const data = (await res.json()).body as HighScore[];
    return data;
  },

  async saveHighScore(score: HighScore): Promise<void> {
    const payload: HighScore = {
      ...score,
    };

    const res = await fetch('/HighScores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to save high score: ${res.status} ${text}`);
    }
  },
};
