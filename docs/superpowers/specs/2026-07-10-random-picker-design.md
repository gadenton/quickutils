# Design Spec: Picker & Narrowing Tool

A lightweight, local-only decision-making utility that provides two modes:
1. **Random Pick**: Instantly pick an option from a user-supplied list with a slot-machine style cycling animation.
2. **3-2-1 Narrow**: A pass-and-play local game/flow where Player 1 and Player 2 take turns narrowing down a list of options until a single winner is decided.

## UI Structure

The tool resides in a new tab: **Picker** (`🎯`). It features three views:

### 1. Setup View (`view-setup`)
- **Input Method Toggle**: A segmented control to switch between:
  - **Paste Text**: A single `<textarea>` for copy-pasting options (one per line).
  - **Add Items**: An interactive tag list with an input field, an "Add" button, and delete buttons (`×`) next to each added option.
- **Syncing Behavior**: Both input views share the same underlying list state. Modifying the textarea updates the interactive list, and vice versa.
- **Action Buttons**:
  - **Random Pick**: Disabled if options < 1.
  - **3-2-1 Narrow**: Disabled if options < 2.

### 2. Random Pick View (`view-random`)
- Shows a clean results screen.
- Clicking "Pick" runs a 500ms shuffle animation that cycles through options before settling on a winner.
- Provides "Pick Again" and "Back to List" buttons.

### 3. 3-2-1 Narrow View (`view-narrow`)
- Guides users through a step-by-step game.
- **Dynamic Steps Setup**:
  - Let $N$ be the initial number of options.
  - If $N \ge 4$:
    - Step 1: **Player 1** chooses exactly **3** options to keep.
    - Step 2: **Player 2** chooses exactly **2** options to keep.
    - Step 3: **Player 1** chooses exactly **1** option as the winner.
  - If $N = 3$:
    - Step 1: **Player 2** chooses exactly **2** options to keep.
    - Step 2: **Player 1** chooses exactly **1** option as the winner.
  - If $N = 2$:
    - Step 1: **Player 1** chooses exactly **1** option as the winner.
- **Interaction**:
  - Options are displayed as clickable cards.
  - Confirm button remains disabled until the exact target number of options is selected.
  - Clicking "Confirm" transitions to the next step, updates the active option list to the selected subset, and alternates the active player.
- **Victory Screen**:
  - Displays the winning option with a victory layout.
  - Provides a "Back to Setup" button.

## Files to Add/Modify

### [NEW] [picker.js](file:///c:/Users/greg_/source/quickutils/tools/picker.js)
Contains state management for:
- Current input method (text area vs tag list).
- Option lists (`options`).
- Game steps (current phase, active player, active subset, and selected indices).
- Event listeners for inputs, list rendering, animations, and game confirmation.

### [NEW] [picker.css](file:///c:/Users/greg_/source/quickutils/tools/picker.css)
- Input formatting (textarea/tag list).
- Card grids and select states.
- Animations (shake/shuffle, victory scaling, active player transition indicator).

### [MODIFY] [index.html](file:///c:/Users/greg_/source/quickutils/index.html)
- Add stylesheet reference `<link rel="stylesheet" href="tools/picker.css">`.
- Insert `<section id="picker">` containing the setup, random, and narrow view markup.
- Add "Picker" button to the `<nav class="tab-bar">`.

### [MODIFY] [app.js](file:///c:/Users/greg_/source/quickutils/app.js)
- Import `* as picker` from `./tools/picker.js`.
- Call `picker.init()` in initialization script.

## Verification Plan

### Manual Verification
- Verify text area input automatically syncs to interactive tag list.
- Verify interactive tags sync back to text area.
- Verify "Random Pick" works and shuffles option text before choosing one.
- Verify 3-2-1 flow dynamically adjusts steps:
  - Try starting with 5 options $\rightarrow$ verify Player 1 narrows to 3 $\rightarrow$ Player 2 narrows to 2 $\rightarrow$ Player 1 narrows to 1.
  - Try starting with 3 options $\rightarrow$ verify Player 2 narrows to 2 $\rightarrow$ Player 1 narrows to 1.
  - Try starting with 2 options $\rightarrow$ verify Player 1 narrows to 1.
- Verify responsive scaling on small screen layouts (max-width 480px).
