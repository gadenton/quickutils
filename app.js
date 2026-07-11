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

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.warn('SW registration failed:', err);
    });
  }
})();
