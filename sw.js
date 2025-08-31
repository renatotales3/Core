// Service Worker for Core PWA

const CACHE_NAME = 'core-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/style.css',
  '/src/app.js',
  '/manifest.json',
  '/assets/icons/icon-192x192.svg',
  '/assets/icons/icon-512x512.svg',
  '/sw.js'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching');
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
