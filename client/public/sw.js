// public/sw.js
const CACHE_NAME = 'pristine-primier-v1.0.7';
const STATIC_CACHE = 'pristine-primier-static-v1.0.7';

// Caching Static assets that don't change often
const staticAssetsToCache = [
  '/manifest.json',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/apple-touch-icon.png',
  '/logorealestate.png',
  '/favicon.ico',
  '/favicon-96x96.png',
  '/favicon.svg'
];

self.addEventListener('install', (event) => {
  console.log('🟢 Service Worker installing');
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('📦 Caching static assets');
          return cache.addAll(staticAssetsToCache);
        }),
      // Force activation immediately
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('🟢 Service Worker activating');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control immediately
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // For HTML documents - NETWORK FIRST
  if (event.request.destination === 'document' || 
      url.pathname === '/' || 
      url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If network fails, try cache as fallback
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For JS, CSS files - CACHE FIRST, then NETWORK
  if (event.request.destination === 'script' || 
      event.request.destination === 'style' ||
      url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version if available
          if (response) {
            return response;
          }
          // Otherwise fetch from network and cache it
          return fetch(event.request).then((fetchResponse) => {
            // Don't cache if not successful
            if (!fetchResponse || fetchResponse.status !== 200) {
              return fetchResponse;
            }
            
            // Clone the response and cache it
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return fetchResponse;
          });
        })
    );
    return;
  }
  
  // For static assets - CACHE FIRST
  if (staticAssetsToCache.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
    return;
  }
  
  // Default: NETWORK FIRST for everything else
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});