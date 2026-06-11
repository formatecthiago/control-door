const CACHE_NAME = 'virty-morador-vfinal';

// Instalação direta e limpa
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Ativação limpando qualquer lixo antigo
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// Busca direta na rede (Garante que o áudio toque buscando direto do GitHub)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
