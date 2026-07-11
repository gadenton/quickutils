(function () {
  'use strict';

  // --- Tab Navigation ---
  var tabBar = document.querySelector('.tab-bar');
  var tabs = tabBar.querySelectorAll('button');
  var sections = document.querySelectorAll('.tool-section');

  function switchTab(tabName) {
    tabs.forEach(function (btn) {
      var isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
    sections.forEach(function (section) {
      section.classList.toggle('active', section.id === tabName);
    });
  }

  tabBar.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-tab]');
    if (btn) switchTab(btn.dataset.tab);
  });

  // --- Coin Flip ---
  var coinBtn = document.getElementById('coin-btn');
  var coinInner = coinBtn.querySelector('.coin-inner');
  var coinResult = document.getElementById('coin-result');
  var isFlipping = false;

  coinBtn.addEventListener('click', function () {
    if (isFlipping) return;
    isFlipping = true;

    var isHeads = Math.random() < 0.5;

    // Remove previous state
    coinInner.classList.remove('show-tails');
    coinInner.style.animation = 'none';
    coinInner.offsetHeight; // force reflow

    if (isHeads) {
      coinInner.style.animation = 'coinFlip 0.6s ease-in-out forwards';
    } else {
      coinInner.style.animation = 'coinFlipToTails 0.6s ease-in-out forwards';
    }

    coinResult.textContent = '';

    setTimeout(function () {
      coinInner.style.animation = '';
      coinInner.classList.toggle('show-tails', !isHeads);
      coinResult.textContent = isHeads ? 'Heads!' : 'Tails!';
      isFlipping = false;
    }, 600);
  });

  // --- Dice Roller ---
  var diceTypeRow = document.getElementById('dice-type-row');
  var diceCountRow = document.getElementById('dice-count-row');
  var diceRollBtn = document.getElementById('dice-roll-btn');
  var diceResults = document.getElementById('dice-results');
  var diceSum = document.getElementById('dice-sum');
  var diceSides = 4;
  var diceCount = 1;

  function setupSegRow(row, callback) {
    row.addEventListener('click', function (e) {
      var btn = e.target.closest('.seg-btn');
      if (!btn) return;
      row.querySelector('.active').classList.remove('active');
      btn.classList.add('active');
      callback(btn);
    });
  }

  setupSegRow(diceTypeRow, function (btn) {
    diceSides = parseInt(btn.dataset.sides, 10);
  });

  setupSegRow(diceCountRow, function (btn) {
    diceCount = parseInt(btn.dataset.count, 10);
  });

  diceRollBtn.addEventListener('click', function () {
    var rolls = [];
    for (var i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * diceSides) + 1);
    }

    diceResults.innerHTML = '';
    rolls.forEach(function (val, idx) {
      var el = document.createElement('div');
      el.className = 'die-result';
      el.textContent = val;
      el.style.animationDelay = (idx * 0.08) + 's';
      diceResults.appendChild(el);
    });

    var total = rolls.reduce(function (a, b) { return a + b; }, 0);
    diceSum.textContent = diceCount > 1 ? 'Total: ' + total : '';
  });

  // --- Random Number ---
  var numMin = document.getElementById('num-min');
  var numMax = document.getElementById('num-max');
  var numGenerateBtn = document.getElementById('num-generate-btn');
  var numResult = document.getElementById('num-result');

  numGenerateBtn.addEventListener('click', function () {
    var min = parseInt(numMin.value, 10);
    var max = parseInt(numMax.value, 10);

    if (isNaN(min) || isNaN(max)) {
      numResult.textContent = '?';
      return;
    }

    if (min > max) {
      var temp = min;
      min = max;
      max = temp;
      numMin.value = min;
      numMax.value = max;
    }

    var result = Math.floor(Math.random() * (max - min + 1)) + min;

    // Re-trigger animation
    numResult.classList.remove('pop');
    numResult.offsetHeight;
    numResult.classList.add('pop');
    numResult.textContent = result;
  });

  // --- Password Generator ---
  var passOutput = document.getElementById('pass-output');
  var passCopyBtn = document.getElementById('pass-copy-btn');
  var passLength = document.getElementById('pass-length');
  var passLengthVal = document.getElementById('pass-length-val');
  var passGenerateBtn = document.getElementById('pass-generate-btn');
  var passFeedback = document.getElementById('pass-feedback');

  var passUpper = document.getElementById('pass-upper');
  var passLower = document.getElementById('pass-lower');
  var passNumbers = document.getElementById('pass-numbers');
  var passSymbols = document.getElementById('pass-symbols');

  var charSets = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  passLength.addEventListener('input', function () {
    passLengthVal.textContent = passLength.value;
  });

  // Prevent unchecking all toggles
  var toggles = [passUpper, passLower, passNumbers, passSymbols];
  toggles.forEach(function (cb) {
    cb.addEventListener('change', function () {
      var anyChecked = toggles.some(function (t) { return t.checked; });
      if (!anyChecked) {
        cb.checked = true;
      }
    });
  });

  function generatePassword() {
    var pool = '';
    if (passUpper.checked) pool += charSets.upper;
    if (passLower.checked) pool += charSets.lower;
    if (passNumbers.checked) pool += charSets.numbers;
    if (passSymbols.checked) pool += charSets.symbols;

    if (pool.length === 0) return '';

    var len = parseInt(passLength.value, 10);
    var arr = new Uint32Array(len);
    crypto.getRandomValues(arr);

    var result = '';
    for (var i = 0; i < len; i++) {
      result += pool[arr[i] % pool.length];
    }
    return result;
  }

  passGenerateBtn.addEventListener('click', function () {
    var pw = generatePassword();
    passOutput.textContent = pw;
    passFeedback.textContent = '';
  });

  passCopyBtn.addEventListener('click', function () {
    var text = passOutput.textContent;
    if (!text || text === 'Tap Generate') return;

    navigator.clipboard.writeText(text).then(function () {
      passFeedback.textContent = 'Copied!';
      setTimeout(function () { passFeedback.textContent = ''; }, 1500);
    }).catch(function () {
      passFeedback.textContent = 'Copy failed — try selecting manually';
    });
  });

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.warn('SW registration failed:', err);
    });
  }
})();
