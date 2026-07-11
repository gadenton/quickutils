(function () {
  'use strict';

  var deferredPrompt;
  var banner = document.getElementById('install-banner');
  var closeBtn = document.getElementById('install-close-btn');
  var confirmBtn = document.getElementById('install-confirm-btn');

  // Check if dismissed in last 7 days
  function isDismissed() {
    var dismissedTime = localStorage.getItem('pwa-prompt-dismissed-time');
    if (!dismissedTime) return false;
    
    var sevenDays = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - parseInt(dismissedTime, 10)) < sevenDays;
  }

  // Intercept the browser's install event
  window.addEventListener('beforeinstallprompt', function (e) {
    // Prevent the default browser mini-infobar prompt
    e.preventDefault();
    // Stash the event so it can be triggered on user action
    deferredPrompt = e;

    // Only show banner if not recently dismissed
    if (!isDismissed()) {
      banner.classList.remove('hidden');
    }
  });

  // Handle Close Button Click
  closeBtn.addEventListener('click', function () {
    banner.classList.add('hidden');
    // Save current timestamp to localStorage
    localStorage.setItem('pwa-prompt-dismissed-time', Date.now().toString());
  });

  // Handle Install Button Click
  confirmBtn.addEventListener('click', function () {
    if (!deferredPrompt) return;

    // Show the browser's native install prompt
    deferredPrompt.prompt();

    // Wait for the user's choice
    deferredPrompt.userChoice.then(function (choiceResult) {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
        banner.classList.add('hidden');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      deferredPrompt = null;
    });
  });

  // Hide the banner if the app is successfully installed
  window.addEventListener('appinstalled', function () {
    console.log('QuickUtils PWA was installed successfully');
    banner.classList.add('hidden');
    deferredPrompt = null;
  });
})();
