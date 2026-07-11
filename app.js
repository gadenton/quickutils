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

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.warn('SW registration failed:', err);
    });
  }
})();
