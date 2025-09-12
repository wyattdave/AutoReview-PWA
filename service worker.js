const CACHE_NAME = `autoreview v3.2.4.2`;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      await cache.addAll([
        './',
        './index.html',
        'manifest.json',
        'icon v2 128.png',
        'assets/img/apple-touch-icon.png',
        'assets/img/logo.svg',
        'assets/img/power devbox black.png',
        'assets/css/mui.min-ar.css',
        'assets/fontawsome/css/fontawesome.css',
        'assets/fontawsome/css/solid.min.css',
        'assets/css/style-ar.css',
        'assets/js/lib/graphre.js',
        'assets/js/lib/nomnoml.js',
        'Configs/config.js',
        'Configs/connectors.js',
        'assets/js/lib/xmlToJson.js',
        'assets/js/lib/jquery-1.10.2.js',
        'assets/js/lib/zip.min.js',
        'assets/js/platform.min.js',
        'assets/js/dev/script.js',
        'assets/js/exception generator.min.js',
        'assets/js/data generator.min.js',
        'assets/js/html generator.min.js',
        'assets/js/lib/mui.min.js',
        'assets/js/diagram.min.js',
        'assets/js/lib/jsonToHTML.js',
        'assets/js/lib/jsonToCsv.js',
        'assets/js/lib/deep-diff.min.js',
        'review.html',
        'report.html',
        'diagram.html',
        'report v2.html',
        'assets/img/logo.svg',
        'assets/img/apple-touch-icon.png',
        'assets/img/logo.svg',
        'assets/img/power devbox black.png',
        'assets/css/mui.min-ar.css',
        'assets/fontawsome/css/fontawesome.css',
        'assets/fontawsome/css/solid.min.css',
        'assets/css/style-ar.css'

      ]);
    } catch (error) {
      console.error('Failed to cache files during install:', error);
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

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        var responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then(function(cache) {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(function() {
        // If network fails, try to return from cache
        return caches.match(event.request)
          .then(function(response) {
            // If not in cache, fallback to index.html
            return response || caches.match('./index.html');
          });
      })
  );
});

