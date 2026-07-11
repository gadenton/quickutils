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

  window.getPickerOptions = function() { return options; }; // for testing/integration
}
