const CACHE_NAME = 'virty-morador-cache-v4'; 

const ASSETS_TO_CACHE = [
  '/control-door/morador/',
  '/control-door/morador/index.html',
  '/control-door/morador/manifest.json',
  '/control-door/morador/icon-192.png',
  '/control-door/morador/icon-512.png',
  '/control-door/morador/sound/sound1.mp3',
  '/control-door/morador/sound/sound2.mp3',
  '/control-door/morador/sound/sound3.mp3',
  '/control-door/morador/sound/sound4.mp3',
  '/control-door/morador/sound/sound5.mp3',
  '/control-door/morador/sound/sound6.mp3',
  '/control-door/morador/sound/sound7.mp3',
  '/control-door/morador/sound/sound8.mp3',
  '/control-door/morador/sound/sound9.mp3',
  '/control-door/morador/sound/sound10.mp3',
  '/control-door/morador/sound/sound11.mp3',
  '/control-door/morador/sound/sound12.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => console.warn('Falha ao cachear:', url, err));
        })
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('gstatic.com')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
