var CACHE_NAME = 'quickutils-20260710-232103';
var ASSETS = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'pwa-install.js',
  'pwa-install.css',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'screenshots/screenshot-mobile.jpg',
  'screenshots/screenshot-desktop.jpg',
  'tools/coin.js',
  'tools/coin.css',
  'tools/dice.js',
  'tools/dice.css',
  'tools/number.js',
  'tools/number.css',
  'tools/password.js',
  'tools/password.css',
  'tools/picker.js',
  'tools/picker.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  // Only intercept GET requests, and ignore non-http schemes (like extensions)
  if (e.request.method !== 'GET' || !e.request.url.startsWith('http')) return;

  e.respondWith((async () => {
    try {
      const response = await fetch(e.request);
      if (response && response.status === 200) {
        const responseToCache = response.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(e.request, responseToCache);
      }
      return response;
    } catch (error) {
      // If network fails (offline), serve the cached version
      return caches.match(e.request);
    }
  })());
});
