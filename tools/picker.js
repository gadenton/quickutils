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
  var eliminateStartBtn = document.getElementById('picker-eliminate-start-btn');

  var options = [];

  // Toggle Inputs
  modePasteBtn.addEventListener('click', function () {
    modePasteBtn.classList.add('active');
    modeListBtn.classList.remove('active');
    pasteContainer.classList.remove('picker-hidden');
    listContainer.classList.add('picker-hidden');
    textarea.focus();
  });

  modeListBtn.addEventListener('click', function () {
    modeListBtn.classList.add('active');
    modePasteBtn.classList.remove('active');
    listContainer.classList.remove('picker-hidden');
    pasteContainer.classList.add('picker-hidden');
    itemInput.focus();
  });

  function updateButtons() {
    randomStartBtn.disabled = options.length < 2;
    eliminateStartBtn.disabled = options.length < 2;
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

  var setupView = document.getElementById('picker-setup-view');
  var randomView = document.getElementById('picker-random-view');
  var randomShuffle = document.getElementById('picker-random-shuffle');
  var randomRollBtn = document.getElementById('picker-random-roll-btn');
  var randomBackBtn = document.getElementById('picker-random-back-btn');

  function showView(view) {
    setupView.classList.add('picker-hidden');
    randomView.classList.add('picker-hidden');
    document.getElementById('picker-eliminate-view').classList.add('picker-hidden');
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

  var eliminateView = document.getElementById('picker-eliminate-view');
  var eliminatePlayerTurn = document.getElementById('picker-eliminate-player-turn');
  var eliminateInstructions = document.getElementById('picker-eliminate-instructions');
  var eliminateCards = document.getElementById('picker-eliminate-cards');
  var eliminateConfirmBtn = document.getElementById('picker-eliminate-confirm-btn');
  var eliminateCancelBtn = document.getElementById('picker-eliminate-cancel-btn');

  var winnerView = document.getElementById('picker-winner-view');
  var winnerResult = document.getElementById('picker-winner-result');
  var winnerBackBtn = document.getElementById('picker-winner-back-btn');

  var eliminateState = {
    pool: [],
    targetEliminate: 0,
    player: 1,
    selectedIndices: []
  };

  eliminateStartBtn.addEventListener('click', function () {
    startEliminating();
  });

  eliminateCancelBtn.addEventListener('click', function () {
    showView(setupView);
  });

  winnerBackBtn.addEventListener('click', function () {
    showView(setupView);
  });

  function startEliminating() {
    eliminateState.pool = options.slice();
    eliminateState.player = 1;
    setupEliminateStep();
    showView(eliminateView);
  }

  function setupEliminateStep() {
    var poolSize = eliminateState.pool.length;
    eliminateState.selectedIndices = [];
    eliminateConfirmBtn.disabled = true;

    if (poolSize <= 1) {
      declareWinner(eliminateState.pool[0]);
      return;
    }

    eliminateState.targetEliminate = 1;

    eliminatePlayerTurn.textContent = 'Player ' + eliminateState.player + '\'s Turn';
    eliminateInstructions.textContent = 'Select 1 option to eliminate';
    renderEliminateCards();
  }

  function renderEliminateCards() {
    eliminateCards.innerHTML = '';
    eliminateState.pool.forEach(function (item, idx) {
      var card = document.createElement('div');
      card.className = 'picker-card';
      card.textContent = item;

      card.addEventListener('click', function () {
        toggleCardSelection(idx, card);
      });

      eliminateCards.appendChild(card);
    });
  }

  function toggleCardSelection(index, cardEl) {
    var selectIdx = eliminateState.selectedIndices.indexOf(index);
    if (selectIdx > -1) {
      eliminateState.selectedIndices.splice(selectIdx, 1);
      cardEl.classList.remove('eliminated');
    } else {
      // Allow selecting exactly 1 item. If another is already selected, swap them.
      if (eliminateState.selectedIndices.length < 1) {
        eliminateState.selectedIndices.push(index);
        cardEl.classList.add('eliminated');
      } else {
        var oldIdx = eliminateState.selectedIndices[0];
        eliminateState.selectedIndices = [index];

        var cards = eliminateCards.children;
        if (cards[oldIdx]) {
          cards[oldIdx].classList.remove('eliminated');
        }
        cardEl.classList.add('eliminated');
      }
    }
    eliminateConfirmBtn.disabled = (eliminateState.selectedIndices.length !== 1);
  }

  eliminateConfirmBtn.addEventListener('click', function () {
    // Keep only the items NOT selected for elimination
    var newPool = [];
    eliminateState.pool.forEach(function (item, idx) {
      if (eliminateState.selectedIndices.indexOf(idx) === -1) {
        newPool.push(item);
      }
    });
    eliminateState.pool = newPool;

    if (eliminateState.pool.length <= 1) {
      declareWinner(eliminateState.pool[0]);
    } else {
      // Alternate players
      eliminateState.player = eliminateState.player === 1 ? 2 : 1;
      setupEliminateStep();
    }
  });

  function declareWinner(winner) {
    winnerResult.textContent = winner;
    showView(winnerView);
  }

  window.getPickerOptions = function () { return options; }; // for testing/integration
}
