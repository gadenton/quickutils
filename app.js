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

  var validTabs = Array.from(tabs).map(function (btn) { return btn.dataset.tab; });

  function switchTab(tabName, updateHash) {
    tabs.forEach(function (btn) {
      var isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
    sections.forEach(function (section) {
      section.classList.toggle('active', section.id === tabName);
    });

    if (updateHash !== false) {
      history.replaceState(null, '', '#' + tabName);
    }

    if (tabName === 'picker') {
      var listContainer = document.getElementById('picker-list-container');
      var itemInput = document.getElementById('picker-item-input');
      var textarea = document.getElementById('picker-textarea');
      
      if (listContainer && !listContainer.classList.contains('picker-hidden')) {
        if (itemInput) itemInput.focus();
      } else {
        if (textarea) textarea.focus();
      }
    }
  }

  tabBar.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-tab]');
    if (btn) switchTab(btn.dataset.tab);
  });

  // Restore tab from URL fragment on load, or navigate via back/forward
  function applyHash() {
    var hash = location.hash.replace('#', '');
    if (hash && validTabs.indexOf(hash) !== -1) {
      switchTab(hash, false);
    }
  }

  applyHash();
  window.addEventListener('hashchange', applyHash);

  // --- Initialize Tools ---
  coin.init();
  dice.init();
  number.init();
  password.init();
  picker.init();

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.warn('SW registration failed:', err);
    });
  }

  // --- Theme-color sync (Chrome Android PWA workaround) ---
  // Chrome Android doesn't re-evaluate media queries on <meta name="theme-color">
  // when switching back from dark to light in standalone mode. It also ignores
  // attribute mutations on existing meta tags. Fix: collapse to a single meta tag
  // with no media attribute, and remove + re-insert it on scheme change to force
  // Chrome to pick up the new value. Color is read from the --bg CSS variable.
  (function () {
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    metas.forEach(function (m) { m.remove(); });

    function applyThemeColor() {
      var existing = document.querySelector('meta[name="theme-color"]');
      if (existing) existing.remove();

      var meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      document.head.appendChild(meta);
    }

    applyThemeColor();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyThemeColor);
  })();
})();
