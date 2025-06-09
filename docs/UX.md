# UI/UX DESIGN DOCUMENT: FORGEBORN: SOLSTICE BREAK

## Main Screens

### 1. Title Screen
- **Background**: Animated SolForge with corruption effects
- **Elements**:
  - Game Title: "FORGEBORN: SOLSTICE BREAK"
  - High Score Display (from Farcade)
  - "Press Any Button to Start" prompt
  - Subtle particle effects showing corruption

### 2. High Score Screen
- **Layout**: Centered, vertical list
- **Elements**:
  - Current High Score (large, prominent)
  - Next Unlock Threshold
  - Progress Bar to Next Unlock
  - List of Available Unlocks
  - "Press Any Button to Continue" prompt

### 3. Character Select
- **Layout**: Horizontal character cards
- **Elements**:
  - Character portraits
  - Character names
  - Locked/Unlocked status
  - Score requirement for locked characters
  - Character preview animation
  - "Select" prompt

### 4. Level Select
- **Layout**: Vertical level list
- **Elements**:
  - Level thumbnails
  - Level names
  - Score requirements
  - Locked/Unlocked status
  - Level preview
  - "Select" prompt

### 5. In-Game HUD
- **Top Bar**:
  - Current Score
  - Combo Counter
  - Combo Multiplier
  - High Score
- **Bottom Bar**:
  - Health Bar
  - Power-up Indicators
  - Current Ability Cooldowns
- **Corner Elements**:
  - Pause Button (top-right)
  - Mini-map (top-left)
  - Objective Indicator (bottom-right)

### 6. Pause Menu
- **Layout**: Centered, vertical list
- **Elements**:
  - "PAUSED" header
  - Resume
  - Restart Level
  - Options
  - Quit to Title
- **Background**: Blurred gameplay

### 7. Options Menu
- **Layout**: Vertical list
- **Elements**:
  - Sound Volume
  - Music Volume
  - Screen Shake Toggle
  - Particle Effects Toggle
  - Control Scheme
  - Back Button

### 8. Level Complete Screen
- **Layout**: Centered, vertical list
- **Elements**:
  - "LEVEL COMPLETE" header
  - Level Score
  - High Score
  - Combo Stats
  - Time Bonus
  - No-Damage Bonus
  - Total Score
  - Continue Button
  - Restart Button

### 9. Game Over Screen
- **Layout**: Centered, vertical list
- **Elements**:
  - "GAME OVER" header
  - Final Score
  - High Score
  - Best Combo
  - Time Survived
  - Retry Button
  - Quit to Title Button

### 10. Power-Up Selection
- **Layout**: Radial menu
- **Elements**:
  - Power-up icons
  - Power-up names
  - Score requirements
  - Selection indicator
  - Confirm button

### 11. Combo Display
- **Layout**: Dynamic overlay
- **Elements**:
  - Combo counter
  - Multiplier
  - Combo name
  - Visual effects
  - Score pop-up

### 12. Boss Introduction
- **Layout**: Full-screen cinematic
- **Elements**:
  - Boss name
  - Boss health bar
  - Introduction text
  - Visual effects
  - "Press Any Button to Continue" prompt

### 13. Unlock Notification
- **Layout**: Pop-up overlay
- **Elements**:
  - "NEW UNLOCK" header
  - Unlock name
  - Unlock description
  - Visual preview
  - "Press Any Button to Continue" prompt

### 14. Loading Screen
- **Layout**: Centered
- **Elements**:
  - Loading bar
  - Loading tip
  - Visual effects
  - High score display

## UI Components

### Buttons
- **Style**: Glowing, Forge-themed
- **States**:
  - Normal
  - Hover
  - Pressed
  - Disabled
- **Feedback**: Sound effects and visual feedback

### Health Bar
- **Style**: Forge energy themed
- **Elements**:
  - Current health
  - Maximum health
  - Damage flash
  - Healing effect

### Score Display
- **Style**: Digital, glowing
- **Elements**:
  - Current score
  - Combo multiplier
  - Score pop-ups
  - High score indicator

### Power-up Icons
- **Style**: Forge-themed
- **States**:
  - Available
  - Active
  - Cooldown
  - Locked

### Character Portraits
- **Style**: Forge energy frame
- **Elements**:
  - Character image
  - Faction symbol
  - Lock status
  - Selection indicator

### Level Thumbnails
- **Style**: Forge-themed frame
- **Elements**:
  - Level preview
  - Level name
  - Score requirement
  - Lock status

## Visual Style

### Color Scheme
- Primary: Forge orange/red
- Secondary: Ice blue
- Accent: Corruption purple
- Background: Dark, metallic

### Typography
- Headers: Bold, angular
- Body: Clean, readable
- Numbers: Digital, glowing
- Special: Forge-themed

### Effects
- Forge energy particles
- Corruption effects
- Ice crystals
- Digital glitches

### Animations
- Smooth transitions
- Forge energy flows
- Corruption spreads
- Ice formations

## Responsive Design
- All UI elements scale with screen size
- Maintain readability at all resolutions
- Consistent spacing and alignment
- Clear visual hierarchy

## Accessibility
- High contrast options
- Scalable text
- Clear visual feedback
- Consistent navigation
- Audio cues for important events 