// public/sw.js 
const CACHE_NAME = 'pristine-primier-v1.0.3';

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('🟢 Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching essential files');
        return cache.addAll([
          '/',
          '/index.html',
          '/site.webmanifest',
          '/web-app-manifest-192x192.png',
          '/web-app-manifest-512x512.png',
          '/apple-touch-icon.png',
          '/logorealestate.png'
        ]);
      })
      .then(() => {
        console.log('🚀 Skip waiting and activate immediately');
        return self.skipWaiting(); // Force activation
      })
  );
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  console.log('🟢 Service Worker activating and claiming clients');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
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
      // Take control of all open pages immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If successful, cache the response
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache, you could return a fallback page
            return new Response('Network error occurred');
          });
      })
  );
});