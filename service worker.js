const CACHE_NAME = `autoreview v3.2.6`;

// All local assets to precache for full offline support
const PRECACHE_URLS = [
  './',
  './index.html',
  './review.html',
  './report.html',
  './diagram.html',
  './exception.html',
  './solution.html',
  './changes.html',
  './manifest.json',

  // CSS
  './assets/css/mui.min-ar.css',
  './assets/css/style-ar.css',
  './assets/fontawsome/css/fontawesome.css',
  './assets/fontawsome/css/solid.min.css',

  // JavaScript - libraries
  './assets/js/lib/graphre.js',
  './assets/js/lib/nomnoml.js',
  './assets/js/lib/xmlToJson.js',
  './assets/js/lib/jquery-1.10.2.js',
  './assets/js/lib/zip.min.js',
  './assets/js/lib/mui.min.js',
  './assets/js/lib/jsonToHTML.js',
  './assets/js/lib/jsonToCsv.js',
  './assets/js/lib/deep-diff.min.js',

  // JavaScript - app
  './assets/js/platform.min.js',
  './assets/js/script.min.js',
  './assets/js/exception generator.min.js',
  './assets/js/data generator.min.js',
  './assets/js/html generator.min.js',
  './assets/js/diagram.min.js',
  './assets/js/diagramLoad.min.js',
  './assets/js/reviewLoad.js',
  './assets/js/reportLoad.js',
  './assets/js/exceptionLoad.js',
  './assets/js/solutionLoad.js',
  './assets/js/changesLoad.js',

  // Configs
  './Configs/config.js',
  './Configs/connectors.js',

  // Images
  './assets/img/logo.svg',
  './assets/img/power devbox black.png',
  './assets/img/key icon.png',
  './assets/img/key2.png',
  './assets/img/autoreview icon 300 v2.png',
  './assets/img/autoreview.svg',
  './assets/img/download.png',
  './assets/img/old flow grey fill.svg',
  './icon v2 128.png',
  './icon v2 192.png',
  './icon v2 512.png',

  // Font Awesome webfonts
  './assets/fontawsome/webfonts/fa-brands-400.ttf',
  './assets/fontawsome/webfonts/fa-brands-400.woff2',
  './assets/fontawsome/webfonts/fa-regular-400.ttf',
  './assets/fontawsome/webfonts/fa-regular-400.woff2',
  './assets/fontawsome/webfonts/fa-solid-900.ttf',
  './assets/fontawsome/webfonts/fa-solid-900.woff2',
  './assets/fontawsome/webfonts/fa-v4compatibility.ttf',
  './assets/fontawsome/webfonts/fa-v4compatibility.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      await cache.addAll(PRECACHE_URLS);
    } catch (error) {
      console.error('Failed to cache files during install:', error);
      // Try caching files individually so one failure doesn't block all
      for (const url of PRECACHE_URLS) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn('Failed to cache:', url, e);
        }
      }
    }
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) {
          return caches.delete(cacheName);
        }
      })
    );
  })());
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // For external requests (analytics, Google Fonts, etc.): network-only, fail silently offline
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('', { status: 408, statusText: 'Offline' }))
    );
    return;
  }

  // For local assets: cache-first, then network (with cache update)
  event.respondWith(
    caches.match(event.request)
      .then(function(cachedResponse) {
        if (cachedResponse) {
          // Update cache in background for freshness
          fetch(event.request).then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(function() { /* offline, ignore */ });
          return cachedResponse;
        }

        // Not in cache — fetch from network and cache it
        return fetch(event.request).then(function(response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });
          return response;
        }).catch(function() {
          // Last resort: return index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('', { status: 408, statusText: 'Offline' });
        });
      })
  );
});

