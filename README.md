# Yahtzee Score Keeper - Full Playable Version

A clean, modern, fully playable Yahtzee web app with Classic and Rainbow (5-color) modes. Built with React, TypeScript, and Tailwind CSS.

## 🎮 Features

### Game Modes
- **Classic Yahtzee**: Traditional numbered dice with full scorecard (Aces-Sixes, 3/4 of a Kind, Full House, Straights, Yahtzee, Chance)
- **Rainbow Mode**: 5-color dice (Red, Blue, Green, Yellow, Purple) with color-based scoring categories

### Gameplay
- **Dice Rolling**: Animated dice rolls with hold/unhold functionality
- **Turn Management**: Up to 3 rolls per turn with visual roll counter
- **Smart Scoring**: Only valid scoring categories are clickable
- **Multi-Player Support**: Add up to 4 players per game
- **Auto-Save**: Game state persists automatically

### Features
- High Scores tracking with sort by highest/most recent
- Settings page with default mode selection
- Mobile-first responsive design
- Clean white background with sage green accents
- Large touch targets for accessibility

## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 🎯 How to Play

1. **Start a Game**: Choose Classic or Rainbow mode, add player names
2. **Roll Dice**: Tap "Start Roll" to begin your turn
3. **Hold Dice**: After first roll, tap dice you want to keep
4. **Roll Again**: Use remaining rolls (up to 3 total)
5. **Score**: After rolling, tap a valid category to score it
6. **Next Turn**: Game automatically moves to next player

### Scoring Rules

**Classic Mode:**
- Upper Section: Sum of matching dice (Aces = 1s, Twos = 2s, etc.)
- Upper Bonus: +35 points if upper section totals 63+
- 3/4 of a Kind: Sum of all dice
- Full House: 25 points
- Small Straight: 30 points
- Large Straight: 40 points
- Yahtzee: 50 points (all 5 dice same)
- Chance: Sum of all dice
- Bonus Yahtzees: +100 points each

**Rainbow Mode:**
- Single Color (All Red, Blue, Green, Yellow, Purple): 50 points each
- 3-Color Mix: 20 points
- 4-Color Mix: 30 points
- Rainbow (all 5 different colors): 40 points
- Color Yahtzee: 50 points
- Bonus Rainbows: +100 points each

## 🏗️ Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── Die.tsx         # Single die with animations
│   ├── DiceRoller.tsx  # Dice rolling UI
│   ├── Interactive*Scorecard.tsx  # Clickable scorecards
│   └── Navigation.tsx  # Bottom navigation
├── pages/              # Page components
│   ├── Index.tsx       # Home/New Game
│   ├── Game.tsx        # Main gameplay
│   ├── HighScores.tsx  # Score history
│   └── Settings.tsx    # App settings
├── services/           # Business logic (DB-ready)
│   ├── gameService.ts  # Storage abstraction layer
│   ├── scoringEngine.ts         # Classic mode scoring
│   └── rainbowScoringEngine.ts  # Rainbow mode scoring
└── types/              # TypeScript definitions
    └── game.ts         # All game types
```

### Database-Ready Architecture

The app uses a **service layer pattern** that abstracts storage. Currently uses `localStorage`, but designed for easy migration to a real database.

**Current Implementation (localStorage):**

```typescript
// src/services/gameService.ts
export const gameService = {
  getCurrentGame(): GameState | null {
    const data = localStorage.getItem('yahtzee_current_game');
    return data ? JSON.parse(data) : null;
  },
  
  saveCurrentGame(gameState: GameState): void {
    localStorage.setItem('yahtzee_current_game', JSON.stringify(gameState));
  },
  
  // ... more methods
};
```

**To Switch to a Real Backend:**

1. Keep the same service interface
2. Replace implementations with API calls
3. No changes needed in components!

```typescript
// Example: Switch to API backend
export const gameService = {
  async getCurrentGame(): Promise<GameState | null> {
    const response = await fetch('/api/games/current');
    return response.json();
  },
  
  async saveCurrentGame(gameState: GameState): Promise<void> {
    await fetch('/api/games/current', {
      method: 'POST',
      body: JSON.stringify(gameState),
    });
  },
  
  // ... update other methods similarly
};
```

**Backend Endpoints Needed:**
- `GET /api/games/current` - Fetch current game
- `POST /api/games/current` - Save game state
- `DELETE /api/games/current` - Clear current game
- `GET /api/high-scores` - List high scores
- `POST /api/high-scores` - Save new high score
- `DELETE /api/high-scores/:id` - Delete score
- `GET /api/settings` - Get user settings
- `POST /api/settings` - Update settings

## 🎨 Design System

The app uses a clean, minimalist design with a sage green accent:

- **Background**: Warm white (#F5F3ED)
- **Primary**: Sage green (HSL: 156 42% 48%)
- **Text**: Dark green-gray for contrast
- **Dice Colors** (Rainbow Mode):
  - Red: HSL(0, 72%, 51%)
  - Blue: HSL(221, 83%, 53%)
  - Green: HSL(142, 71%, 45%)
  - Yellow: HSL(45, 93%, 47%)
  - Purple: HSL(271, 81%, 56%)

All colors defined in `src/index.css` as CSS variables for easy theming.

## 🔧 Technologies

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation
- **shadcn/ui** components
- **Lucide React** icons

## 🎯 Future Enhancements

- Sound effects for dice rolls and scoring
- Game statistics and player analytics
- Export/share high scores
- Achievements system
- Online multiplayer with WebSockets
- User accounts with cloud sync