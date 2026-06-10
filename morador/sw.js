// sw.js - Cache de Longo Prazo para Áudios Locais Virti
const CACHE_NAME = 'virty-morador-cache-v2';

// Lista de arquivos vitais que o PWA precisa armazenar no celular
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  // Se você tiver um manifest.json ou ícones, adicione aqui (ex: './manifest.json')
  
  // Lista dos 12 sons locais mapeados estritamente com o index.html
  './sound/sound1.mp3',
  './sound/sound2.mp3',
  './sound/sound3.mp3',
  './sound/sound4.mp3',
  './sound/sound5.mp3',
  './sound/sound6.mp3',
  './sound/sound7.mp3',
  './sound/sound8.mp3',
  './sound/sound9.mp3',
  './sound/sound10.mp3',
  './sound/sound11.mp3',
  './sound/sound12.mp3'
];

// Instalação do Service Worker e Cache dos arquivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Virty SW: Armazenando arquivos de interface e áudios em Cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Força a atualização imediata
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Virty SW: Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de Cache First (Busca no cache primeiro, garante que o som toque instantaneamente)
self.addEventListener('fetch', (event) => {
  // Ignora requisições para o Firebase (tempo real não pode ir para o cache)
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Retorna do cache local do celular de forma instantânea
      }
      
      // Se não estiver no cache, busca na rede
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clona e salva dinamicamente novos arquivos locais caso apareçam
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
