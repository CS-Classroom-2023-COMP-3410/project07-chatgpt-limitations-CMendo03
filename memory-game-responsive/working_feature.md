# Working Feature: Dynamic Fruit Border Update

## Overview

This feature update enhances the Memory Matching Game by making the dancing fruit border follow the game container dynamically as its size and position change. The fruit border is now recalculated in real time without requiring the game to be restarted. Now when inspecting the page and changing the game container sizes, we can see that the dancing fruit border moves along with it. It does this by using the `ResizeObserver`to change the fruit but also `window.resize` if the change is not supported for the browser. 

## Changes Made

## JavaScript changes
- **Dynamic Update with ResizeObserver:**  
  - Implemented a `ResizeObserver` to monitor changes to the `.game-container` element.  
  - Every time the container's dimensions change the `generateFruitBorder()` function is triggered which results in the border connecting with the container and being dynamic.

- **Fallback Mechanism:**  
  - Added a fallback using the `window.resize` event in case the browser does not support `ResizeObserver`.

- **Fruit Border Generation:**  
  - Adjusted the `generateFruitBorder()` function to calculate positions based on the current bounding rectangle of the game container.  
  - An offset is used so that the fruit icons do not overlap the game container.

## HTML changes
- **Structural Update:**  
  - Wrapped the game container and fruit border within a new `.game-wrapper` div.  
  - This ensures that the fruit border is positioned relative to the game container and can update dynamically with its size and position.

## CSS changes
- **Styling Adjustments:**  
  - Updated styles for the `.game-wrapper` and `.fruit-border` classes to support dynamic positioning and responsiveness.
  - No major changes, changing the CSS in order to match the matching fruits, animations not changed. 


