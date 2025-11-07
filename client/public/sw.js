// public/sw.js 
const CACHE_NAME = 'pristine-primier-v1.0.4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/apple-touch-icon.png',
  '/logorealestate.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  console.log('🟢 Service Worker installing and taking control immediately');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force activation immediately
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('🟢 Service Worker activating and claiming clients');
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Use cache-first strategy for better PWA recognition
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});