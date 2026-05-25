// Service Worker básico para permitir a instalação do PWA
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Permite que as requisições em tempo real do Firebase passem direto sem travar no cache
  e.respondWith(fetch(e.request));
});
