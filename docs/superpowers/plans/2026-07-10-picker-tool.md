# Picker & Narrowing Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Picker tool/tab containing both Random Selection and 3-2-1 Narrow-down game flows with synchronized options input.

**Architecture:** Use a single new tool section `#picker` in `index.html` containing state-driven views. Write all picker logic in `tools/picker.js` and styling in `tools/picker.css`, and register the tool initialization inside `app.js`.

**Tech Stack:** Vanilla JavaScript (ES5 modules), CSS, HTML.

## Global Constraints
- Do not use semantic commit prefixes (e.g. `feat:`, `docs:`, `chore:`) in git commits. Use simple descriptions instead.
- Do not edit file extensions: `.ipynb` (not present in this repository).
- All changes must be responsive and follow the mobile container layout styling in `style.css`.

---

### Task 1: Add HTML Structure and Navigation

**Files:**
- Create: [tools/picker.js](file:///c:/Users/greg_/source/quickutils/tools/picker.js)
- Create: [tools/picker.css](file:///c:/Users/greg_/source/quickutils/tools/picker.css)
- Modify: [index.html](file:///c:/Users/greg_/source/quickutils/index.html)
- Modify: [app.js](file:///c:/Users/greg_/source/quickutils/app.js)

**Interfaces:**
- Consumes: `app.js` and standard styles.
- Produces: `picker.init()` called inside `app.js` to set up listeners.

- [ ] **Step 1: Create basic stubs for JS and CSS files**

Create [tools/picker.js](file:///c:/Users/greg_/source/quickutils/tools/picker.js) with the following content:
```javascript
export function init() {
  console.log('Picker initialized');
}
```

Create [tools/picker.css](file:///c:/Users/greg_/source/quickutils/tools/picker.css) as an empty file.

- [ ] **Step 2: Modify index.html to include Picker markup and stylesheet link**

Insert `<link rel="stylesheet" href="tools/picker.css">` right after password stylesheet link:
```html
  <link rel="stylesheet" href="tools/password.css">
  <link rel="stylesheet" href="tools/picker.css">
```

Insert Picker button in tab-bar:
```html
      <button data-tab="password">
        <span class="tab-icon">🔑</span>
        <span>Password</span>
      </button>
      <button data-tab="picker">
        <span class="tab-icon">🎯</span>
        <span>Picker</span>
      </button>
```

Insert Picker tool-section into `<main>` (after `<section id="password">`):
```html
      <!-- Picker & Narrowing Tool -->
      <section id="picker" class="tool-section" aria-label="Picker and Narrowing Tool">
        <!-- Setup View -->
        <div id="picker-setup-view" class="picker-view active">
          <h1 class="tool-title">Picker</h1>
          <p class="tool-subtitle">Enter options to pick or narrow down</p>
          
          <div class="seg-row" id="picker-input-mode-row">
            <button class="seg-btn active" id="picker-mode-paste-btn" type="button">Paste Text</button>
            <button class="seg-btn" id="picker-mode-list-btn" type="button">Add Items</button>
          </div>

          <div id="picker-paste-container" class="picker-input-container">
            <textarea id="picker-textarea" class="input-field" placeholder="Enter options, one per line..." rows="6"></textarea>
          </div>

          <div id="picker-list-container" class="picker-input-container picker-hidden">
            <div class="picker-add-row">
              <input type="text" id="picker-item-input" class="input-field" placeholder="Add an option...">
              <button id="picker-add-btn" class="btn-primary" type="button">Add</button>
            </div>
            <div id="picker-tags-list" class="picker-tags-list"></div>
          </div>

          <div class="picker-action-buttons">
            <button id="picker-random-start-btn" class="btn-primary" disabled type="button">Random Pick</button>
            <button id="picker-narrow-start-btn" class="btn-primary" disabled type="button">3-2-1 Narrow</button>
          </div>
        </div>

        <!-- Random View -->
        <div id="picker-random-view" class="picker-view picker-hidden">
          <h1 class="tool-title">Random Pick</h1>
          <div class="picker-shuffle-container">
            <div id="picker-random-shuffle" class="picker-shuffle-box">Press Pick</div>
          </div>
          <div class="picker-action-buttons">
            <button id="picker-random-roll-btn" class="btn-primary" type="button">Pick Again</button>
            <button id="picker-random-back-btn" class="btn-primary" type="button">Back to Setup</button>
          </div>
        </div>

        <!-- Narrow View -->
        <div id="picker-narrow-view" class="picker-view picker-hidden">
          <h1 class="tool-title">3-2-1 Narrow</h1>
          <p id="picker-narrow-player-turn" class="tool-subtitle">Player 1 Turn</p>
          <div id="picker-narrow-instructions" class="picker-instructions">Select items to keep</div>
          
          <div id="picker-narrow-cards" class="picker-cards-grid"></div>

          <div class="picker-action-buttons">
            <button id="picker-narrow-confirm-btn" class="btn-primary" disabled type="button">Confirm Selection</button>
            <button id="picker-narrow-cancel-btn" class="btn-primary" type="button">Cancel</button>
          </div>
        </div>

        <!-- Winner View -->
        <div id="picker-winner-view" class="picker-view picker-hidden">
          <h1 class="tool-title">Winner!</h1>
          <div class="picker-winner-container">
            <div id="picker-winner-result" class="picker-winner-box"></div>
          </div>
          <button id="picker-winner-back-btn" class="btn-primary" type="button">Done</button>
        </div>
      </section>
```

- [ ] **Step 3: Modify app.js to import and initialize picker**

Add the import line at the top of [app.js](file:///c:/Users/greg_/source/quickutils/app.js):
```javascript
import * as picker from './tools/picker.js';
```

And initialize inside the main IIFE function list:
```javascript
  // --- Initialize Tools ---
  coin.init();
  dice.init();
  number.init();
  password.init();
  picker.init();
```

- [ ] **Step 4: Verify navigation works**

Start the server using: `npx serve .` and verify opening `http://localhost:3000` (or the printed port) allows switching to the "Picker" tab and shows the stub setup view.

- [ ] **Step 5: Commit changes**

Run:
```bash
git add index.html app.js tools/picker.js tools/picker.css
git commit -m "Add navigation and HTML markup for Picker tool"
```

---

### Task 2: Implement Options Entry Logic and Syncing

**Files:**
- Modify: [tools/picker.js](file:///c:/Users/greg_/source/quickutils/tools/picker.js)

**Interfaces:**
- Consumes: DOM inputs in the setup view.
- Produces: Synced list of options (`options` array) and updates buttons status.

- [ ] **Step 1: Add option state and synchronization handlers**

Replace [tools/picker.js](file:///c:/Users/greg_/source/quickutils/tools/picker.js) content to handle options sync:
```javascript
export function init() {
  var textarea = document.getElementById('picker-textarea');
  var itemInput = document.getElementById('picker-item-input');
  var addBtn = document.getElementById('picker-add-btn');
  var tagsList = document.getElementById('picker-tags-list');
  var modePasteBtn = document.getElementById('picker-mode-paste-btn');
  var modeListBtn = document.getElementById('picker-mode-list-btn');
  var pasteContainer = document.getElementById('picker-paste-container');
  var listContainer = document.getElementById('picker-list-container');
  var randomStartBtn = document.getElementById('picker-random-start-btn');
  var narrowStartBtn = document.getElementById('picker-narrow-start-btn');

  var options = [];

  // Toggle Inputs
  modePasteBtn.addEventListener('click', function () {
    modePasteBtn.classList.add('active');
    modeListBtn.classList.remove('active');
    pasteContainer.classList.remove('picker-hidden');
    listContainer.classList.add('picker-hidden');
  });

  modeListBtn.addEventListener('click', function () {
    modeListBtn.classList.add('active');
    modePasteBtn.classList.remove('active');
    listContainer.classList.remove('picker-hidden');
    pasteContainer.classList.add('picker-hidden');
  });

  function updateButtons() {
    randomStartBtn.disabled = options.length < 1;
    narrowStartBtn.disabled = options.length < 2;
  }

  function renderTags() {
    tagsList.innerHTML = '';
    options.forEach(function (opt, idx) {
      var tag = document.createElement('div');
      tag.className = 'picker-tag';
      
      var text = document.createElement('span');
      text.textContent = opt;
      tag.appendChild(text);

      var removeBtn = document.createElement('button');
      removeBtn.className = 'picker-tag-remove';
      removeBtn.textContent = '×';
      removeBtn.type = 'button';
      removeBtn.addEventListener('click', function () {
        removeOptionAt(idx);
      });
      tag.appendChild(removeBtn);

      tagsList.appendChild(tag);
    });
  }

  function updateTextareaFromOptions() {
    textarea.value = options.join('\n');
  }

  function updateOptionsFromTextarea() {
    options = textarea.value
      .split('\n')
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
    renderTags();
    updateButtons();
  }

  function addOption(opt) {
    var trimmed = opt.trim();
    if (trimmed.length > 0) {
      options.push(trimmed);
      updateTextareaFromOptions();
      renderTags();
      updateButtons();
    }
  }

  function removeOptionAt(index) {
    options.splice(index, 1);
    updateTextareaFromOptions();
    renderTags();
    updateButtons();
  }

  textarea.addEventListener('input', updateOptionsFromTextarea);

  addBtn.addEventListener('click', function () {
    addOption(itemInput.value);
    itemInput.value = '';
  });

  itemInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addOption(itemInput.value);
      itemInput.value = '';
    }
  });

  window.getPickerOptions = function() { return options; }; // for testing/integration
}
```

- [ ] **Step 2: Verify synchronization**

Open the browser:
1. Under "Paste Text", type "Apple", "Banana", "Cherry" on separate lines.
2. Toggle to "Add Items" and verify 3 tags exist.
3. Remove "Banana" using the `×` button.
4. Toggle back to "Paste Text" and verify it now reads "Apple" and "Cherry".
5. Verify "Random Pick" and "3-2-1 Narrow" buttons are enabled.

- [ ] **Step 3: Commit changes**

Run:
```bash
git add tools/picker.js
git commit -m "Implement synced options entry lists"
```

---

### Task 3: Implement CSS Styling for the Picker

**Files:**
- Modify: [tools/picker.css](file:///c:/Users/greg_/source/quickutils/tools/picker.css)

**Interfaces:**
- Consumes: CSS variables from `style.css`.
- Produces: Formatted Picker UI elements.

- [ ] **Step 1: Write stylesheet content**

Fill [tools/picker.css](file:///c:/Users/greg_/source/quickutils/tools/picker.css) with:
```css
.picker-hidden {
  display: none !important;
}

.picker-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.picker-input-container {
  width: 100%;
  min-height: 150px;
}

.picker-add-row {
  display: flex;
  gap: 8px;
  width: 100%;
  margin-bottom: 16px;
}

.picker-add-row .input-field {
  flex: 1;
}

.picker-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.picker-tag {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  animation: pickerPop 0.15s ease-out;
}

.picker-tag-remove {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.picker-tag-remove:hover {
  color: var(--dice-accent);
}

.picker-action-buttons {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.picker-action-buttons .btn-primary {
  flex: 1;
  min-width: 140px;
  padding: 12px 20px;
}

.picker-action-buttons .btn-primary:disabled {
  background: var(--bg-elevated);
  color: var(--text-secondary);
  cursor: not-allowed;
  transform: none;
  opacity: 0.6;
}

/* Random View Styling */
.picker-shuffle-container {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: inset 0 0 10px var(--shadow);
}

.picker-shuffle-box {
  font-size: 28px;
  font-weight: 700;
  color: var(--number-accent);
  text-align: center;
  padding: 10px;
  transition: transform 0.1s ease;
}

.picker-shuffle-active {
  animation: pickerRoll 0.1s infinite alternate;
}

/* Narrow View Card Grid Styling */
.picker-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  margin: 16px 0;
}

.picker-card {
  background: var(--bg-surface);
  border: 2px solid var(--border);
  color: var(--text-primary);
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.picker-card.selected {
  border-color: var(--accent);
  background: rgba(110, 90, 220, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(110, 90, 220, 0.2);
}

.picker-instructions {
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
  text-align: center;
}

/* Winner View Styling */
.picker-winner-container {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  border-radius: 16px;
  border: 2px solid var(--number-accent);
  box-shadow: 0 8px 24px rgba(32, 201, 176, 0.25);
  animation: pickerWinnerReveal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.picker-winner-box {
  font-size: 32px;
  font-weight: 800;
  color: var(--number-accent);
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

/* Animations */
@keyframes pickerPop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pickerRoll {
  0% { transform: translateY(-5px) scale(0.95); opacity: 0.8; }
  100% { transform: translateY(5px) scale(1.05); opacity: 0.8; }
}

@keyframes pickerWinnerReveal {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
```

- [ ] **Step 2: Verify visuals**

Switch to Picker tab, type some text, and observe the custom segmented controls, add/remove transitions, and custom styles matching the dark/light mode context.

- [ ] **Step 3: Commit changes**

Run:
```bash
git add tools/picker.css
git commit -m "Add custom stylesheet for Picker modes"
```

---

### Task 4: Implement Random Selector View and Flow

**Files:**
- Modify: [tools/picker.js](file:///c:/Users/greg_/source/quickutils/tools/picker.js)

**Interfaces:**
- Consumes: Synced options list.
- Produces: A randomly selected winning item, with roll animations.

- [ ] **Step 1: Implement random roll logic and view toggles**

Append or update [tools/picker.js](file:///c:/Users/greg_/source/quickutils/tools/picker.js) to support Random Pick:
```javascript
// Add these lines to the end of the init() function in tools/picker.js:

  var setupView = document.getElementById('picker-setup-view');
  var randomView = document.getElementById('picker-random-view');
  var randomShuffle = document.getElementById('picker-random-shuffle');
  var randomRollBtn = document.getElementById('picker-random-roll-btn');
  var randomBackBtn = document.getElementById('picker-random-back-btn');

  function showView(view) {
    setupView.classList.add('picker-hidden');
    randomView.classList.add('picker-hidden');
    document.getElementById('picker-narrow-view').classList.add('picker-hidden');
    document.getElementById('picker-winner-view').classList.add('picker-hidden');
    view.classList.remove('picker-hidden');
  }

  function rollRandom() {
    if (options.length === 0) return;
    randomRollBtn.disabled = true;
    randomBackBtn.disabled = true;
    randomShuffle.classList.add('picker-shuffle-active');

    var duration = 600;
    var intervalTime = 60;
    var timer = 0;

    var rollInterval = setInterval(function () {
      var randOpt = options[Math.floor(Math.random() * options.length)];
      randomShuffle.textContent = randOpt;
      timer += intervalTime;
      if (timer >= duration) {
        clearInterval(rollInterval);
        var finalWinner = options[Math.floor(Math.random() * options.length)];
        randomShuffle.textContent = finalWinner;
        randomShuffle.classList.remove('picker-shuffle-active');
        randomRollBtn.disabled = false;
        randomBackBtn.disabled = false;
      }
    }, intervalTime);
  }

  randomStartBtn.addEventListener('click', function () {
    showView(randomView);
    rollRandom();
  });

  randomRollBtn.addEventListener('click', function () {
    rollRandom();
  });

  randomBackBtn.addEventListener('click', function () {
    showView(setupView);
  });
```

- [ ] **Step 2: Verify random roll**

In the browser:
1. Enter: "Red", "Green", "Blue".
2. Click "Random Pick".
3. Check that options shuffle rapidly for ~0.6s and then show a single winner.
4. Verify you can click "Pick Again" to run another shuffle.
5. Click "Back to Setup" to return to the options list.

- [ ] **Step 3: Commit changes**

Run:
```bash
git add tools/picker.js
git commit -m "Implement random selection view and shuffle animation"
```

---

### Task 5: Implement 3-2-1 Narrow-down Game Flow

**Files:**
- Modify: [tools/picker.js](file:///c:/Users/greg_/source/quickutils/tools/picker.js)

**Interfaces:**
- Consumes: Synced options list.
- Produces: Pass-and-play elimination steps leading to a final chosen winner.

- [ ] **Step 1: Implement game state logic and card selection views**

Append or update [tools/picker.js](file:///c:/Users/greg_/source/quickutils/tools/picker.js) to support 3-2-1 Narrow:
```javascript
// Add these lines to the end of the init() function in tools/picker.js:

  var narrowView = document.getElementById('picker-narrow-view');
  var narrowPlayerTurn = document.getElementById('picker-narrow-player-turn');
  var narrowInstructions = document.getElementById('picker-narrow-instructions');
  var narrowCards = document.getElementById('picker-narrow-cards');
  var narrowConfirmBtn = document.getElementById('picker-narrow-confirm-btn');
  var narrowCancelBtn = document.getElementById('picker-narrow-cancel-btn');
  
  var winnerView = document.getElementById('picker-winner-view');
  var winnerResult = document.getElementById('picker-winner-result');
  var winnerBackBtn = document.getElementById('picker-winner-back-btn');

  var narrowState = {
    pool: [],
    targetKeep: 0,
    player: 1,
    selectedIndices: []
  };

  narrowStartBtn.addEventListener('click', function () {
    startNarrowing();
  });

  narrowCancelBtn.addEventListener('click', function () {
    showView(setupView);
  });

  winnerBackBtn.addEventListener('click', function () {
    showView(setupView);
  });

  function startNarrowing() {
    narrowState.pool = options.slice();
    narrowState.player = 1;
    setupNarrowStep();
    showView(narrowView);
  }

  function setupNarrowStep() {
    var poolSize = narrowState.pool.length;
    narrowState.selectedIndices = [];
    narrowConfirmBtn.disabled = true;

    if (poolSize >= 4) {
      narrowState.targetKeep = 3;
    } else if (poolSize === 3) {
      narrowState.targetKeep = 2;
    } else if (poolSize === 2) {
      narrowState.targetKeep = 1;
    } else {
      // 1 option left - should not happen as we catch it earlier, but handle gracefully
      declareWinner(narrowState.pool[0]);
      return;
    }

    narrowPlayerTurn.textContent = 'Player ' + narrowState.player + '\'s Turn';
    narrowInstructions.textContent = 'Keep exactly ' + narrowState.targetKeep + ' of ' + poolSize + ' items';
    renderNarrowCards();
  }

  function renderNarrowCards() {
    narrowCards.innerHTML = '';
    narrowState.pool.forEach(function (item, idx) {
      var card = document.createElement('div');
      card.className = 'picker-card';
      card.textContent = item;
      
      card.addEventListener('click', function () {
        toggleCardSelection(idx, card);
      });

      narrowCards.appendChild(card);
    });
  }

  function toggleCardSelection(index, cardEl) {
    var selectIdx = narrowState.selectedIndices.indexOf(index);
    if (selectIdx > -1) {
      narrowState.selectedIndices.splice(selectIdx, 1);
      cardEl.classList.remove('selected');
    } else {
      // Allow selecting up to targetKeep
      if (narrowState.selectedIndices.length < narrowState.targetKeep) {
        narrowState.selectedIndices.push(index);
        cardEl.classList.add('selected');
      }
    }
    narrowConfirmBtn.disabled = (narrowState.selectedIndices.length !== narrowState.targetKeep);
  }

  narrowConfirmBtn.addEventListener('click', function () {
    // Narrow pool to only selected indices
    var newPool = [];
    narrowState.selectedIndices.forEach(function (idx) {
      newPool.push(narrowState.pool[idx]);
    });
    narrowState.pool = newPool;

    if (narrowState.pool.length <= 1) {
      declareWinner(narrowState.pool[0]);
    } else {
      // Alternate players: 1 -> 2, 2 -> 1
      narrowState.player = narrowState.player === 1 ? 2 : 1;
      setupNarrowStep();
    }
  });

  function declareWinner(winner) {
    winnerResult.textContent = winner;
    showView(winnerView);
  }
```

- [ ] **Step 2: Verify game flow with different counts**

In the browser, test these three scenarios:
1. **5 Options**: Enter A, B, C, D, E. Click 3-2-1 Narrow.
   - Verify Player 1 must select exactly 3 items to keep. Confirm button becomes active only when 3 are clicked.
   - Click Confirm. Verify step switches to Player 2, options become only the 3 chosen, and Player 2 must keep exactly 2.
   - Click Confirm. Verify step switches to Player 1, options are the 2 chosen, and Player 1 picks 1 winner.
   - Click Confirm. Verify winner is displayed. Click Done to return.
2. **3 Options**: Enter A, B, C. Click 3-2-1 Narrow.
   - Verify it starts directly at Phase 2: Player 2 keeps 2.
   - Confirm. Verify Player 1 picks 1 winner.
3. **2 Options**: Enter A, B. Click 3-2-1 Narrow.
   - Verify it starts directly at Phase 3: Player 1 picks 1 winner.

- [ ] **Step 3: Commit changes**

Run:
```bash
git add tools/picker.js
git commit -m "Implement 3-2-1 narrow-down game state machine and views"
```
