import * as coin from './tools/coin.js';
import * as dice from './tools/dice.js';
import * as number from './tools/number.js';
import * as password from './tools/password.js';
import * as picker from './tools/picker.js';

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

  // --- Initialize Tools ---
  coin.init();
  dice.init();
  number.init();
  password.init();
  picker.init();

  // --- Dynamic Theme Color for Android Status Bar ---
  function updateThemeColor() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      var tempEl = document.createElement('div');
      tempEl.style.color = 'AccentColor';
      tempEl.style.position = 'absolute';
      tempEl.style.left = '-9999px';
      document.body.appendChild(tempEl);
      var computedAccent = getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);

      var metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', computedAccent);
      }
    }
  }

  updateThemeColor();

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.warn('SW registration failed:', err);
    });
  }
})();
