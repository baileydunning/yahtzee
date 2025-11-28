# Yahtzee 

A Yahtzee web app built to explore React, TypeScript, Tailwind CSS, and Harper Fabric. Features Classic and Rainbow modes, persistent stats, achievements and high scores stored in Harper. Designed to run smoothly on both mobile and desktop.

**Live Demo:** https://yahtzee.bailey.harperfabric.com/

## Features

### Game Modes
- **Classic Yahtzee**: Traditional numbered dice with full scorecard (Aces-Sixes, 3/4 of a Kind, Full House, Straights, Yahtzee, Chance)
- **Rainbow Mode**: 5-color dice (Red, Blue, Green, Yellow, Purple) with color-based scoring categories
- **Puzzle Mode**: Solve unique, hand-crafted challenges with custom objectives, locked dice, and multi-category goals. Each puzzle tests your strategy and creativity.

## Features

### Game Modes
- Classic Yahtzee with full traditional scorecard
- Rainbow Mode with 5-color dice and unique color-based scoring categories
- Puzzle Mode with custom objectives, locked dice, and multi-category challenges
- Supports 1–4 players per game

### Gameplay
- Animated dice rolls with hold/unhold functionality
- Up to 3 rolls per turn with a visual roll counter
- Valid scoring categories are automatically highlighted
- Automatic turn advancement
- Auto-save for full game state persistence
- Puzzle Mode: Each puzzle starts with a unique setup, may have locked dice, and requires you to meet specific objectives (score in certain categories, reach a target, or solve with constraints).

### Progression and Stats
- High scores tracked for Classic and Rainbow modes (stored in Harper)
- Persistent local statistics
- Per-game scorecard details
- Puzzle Mode: Track your puzzle completions, perfect solves, and attempt history. Progress is saved and achievements are unlockable for puzzle mastery.

### Achievements
- Unlockable achievements for skill, streaks, milestones, and puzzle mastery
- Progress bars for multi-step achievements
- Dual-mode achievements (Classic & Rainbow)
- Puzzle Mode achievements for first clears, perfect solves, tenacious attempts, and more
- Achievement toasts and progress tracking

## Tech Stack

| Layer            | Tools                                      |
|------------------|--------------------------------------------|
| Frontend         | React, TypeScript, Vite, Tailwind CSS      |
| State Management | Custom React hooks, LocalStorage persistence |
| Backend          | Harper for high scores         |
| Hosting          | Harper Fabric                            |
| Build/Deploy     | GitHub → Fabric deployment                 |

## How to Play

### Classic & Rainbow Modes
1. **Start a Game**: Choose Classic or Rainbow mode, add player names
2. **Roll Dice**: Tap "Start Roll" to begin your turn
3. **Hold Dice**: After first roll, tap dice you want to keep
4. **Roll Again**: Use remaining rolls (up to 3 total)
5. **Score**: After rolling, tap a valid category to score it
6. **Next Turn**: Game automatically moves to next player

### Puzzle Mode
1. **Browse Puzzles**: Select Puzzle Mode and choose a challenge from the puzzle list
2. **Review Objective**: Each puzzle has a unique goal (score in specific categories, reach a target, or solve with locked dice)
3. **Roll & Hold Dice**: Use up to 3 rolls per turn, holding dice as needed
4. **Meet the Objective**: Score in the required categories or reach the target to complete the puzzle
5. **Retry or Advance**: If you fail, retry the puzzle. If you succeed, move to the next challenge!

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
- Rainbow (all 5 different colors): 50 points

**Puzzle Mode:**
- Each puzzle has its own objective: score in specific categories, reach a minimum total, or solve with locked dice and constraints
- Success is determined by meeting the puzzle's goal, not by traditional scoring alone