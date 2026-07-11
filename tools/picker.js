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

  window.getPickerOptions = function() { return options; }; // for testing/integration
}
