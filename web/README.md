# Yahtzee 

A clean, modern, fully playable Yahtzee web app with Classic and Rainbow (5-color) modes. Built with React, TypeScript, and Tailwind CSS.

## Features

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

## How to Play

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