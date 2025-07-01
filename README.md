# Forgeborn: Solstice Break – Vertical Slice Demo

A documentation-driven HTML5 game prototype.

## How to Play

- **Open `index.html` in your browser**.
- Choose a character (Korok/Oros/Cercee).
- Use the following **controls**:
  - **Arrow keys:** Move left/right/jump.
  - **Z:** Light attack.
  - **X:** Heavy attack.
  - **C:** Dodge.
- Defeat all enemies to clear the scene.
- If you lose all health, it's game over.
- When victorious or defeated, click **Back to Menu** to try again.

## Design & Features

This vertical slice implements the documented design from `/docs/GDD.md` and `/docs/UI_MOCKUPS.md`:

- **Start screen** and **character selection** match documented layouts and styling.
- **Gameplay UI** uses the specified color scheme (`#151923`, `#232841`, `#7fc3fe`, etc.) and fonts.
- **First level:** Frozen Wastes Scene 1 with pre-documented enemy types.
- **Player/enemy logic** implements basic movement/combat per documentation.
- **Game states:** Menu → Playing → Win/Lose screens per UX docs.
- **UI elements:** Health bar, score counter, character display match documentation.
- **Background art:** Loads PNG as specified in docs.

## Expansion

See `/docs/GDD.md` for adding new scenes/levels/characters following modular documented patterns.

---