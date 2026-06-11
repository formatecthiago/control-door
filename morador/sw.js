const CACHE_NAME = 'virty-morador-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './sound/sound01.mp3',
  './sound/sound02.mp3',
  './sound/sound03.mp3',
  './sound/sound04.mp3',
  './sound/sound05.mp3',
  './sound/sound06.mp3',
  './sound/sound07.mp3',
  './sound/sound08.mp3',
  './sound/sound09.mp3',
  './sound/sound10.mp3',
  './sound/sound11.mp3',
  './sound/sound12.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
