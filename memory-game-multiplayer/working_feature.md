# Memory Matching Game – Head-to-Head Feature

## Overview

This update introduces a the head to head multiplayer game that the person could not get. The game now supports turn-based gameplay where players take turns flipping cards. When a player finds a match, their score increases and they continue their turn; if they don't match, the turn switches to the other player. The game displays the current turn and each player's matched pairs count and at the end the total for the amount of cards are given.

## Changes Made

## HTML changes
- **Player Info Section:**
  - Gave each player their own ID in order to hold the score
    - The current player's turn (`<span id="currentPlayerDisplay">`).
    - Player 1’s matched pairs count (`<span id="player1Score">`).
    - Player 2’s matched pairs count (`<span id="player2Score">`).


## JavaScript changes
- **New Variables:**
  - `currentPlayer`: To keep track of what player is playing
  - `playerScores`: Keep track of players 1 and 2


## CSS changes
- **Player Info Styling:**
  - Added styling for the new `.player-info` class to ensure the player information section blends with the existing jungle-themed design.
  - The layout uses flexbox to neatly display the current turn and both players' scores.


- **Game Initialization:**
  - Resets `currentPlayer` to 1 and `playerScores` to `{1: 0, 2: 0}` at the start of each game.
  - Calls `updatePlayerDisplay()` to update the DOM with initial turn and score information.

- **Card Matching Logic for new changes:**
  - **When a match is found:**
    - The current player's score is incremented.
    - The player retains the turn (i.e., no switch is made).
  - **When no match is found:**
    - Calls `switchTurn()` to alternate the turn between players.
- **Display Updates:**
  - The `updatePlayerDisplay()` function updates the DOM elements in order to reflect the current scores. 

