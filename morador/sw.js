const CACHE_NAME = 'virty-cache-vfinal';

// Lista exata com caminhos relativos para garantir o download imediato no celular
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

// EVENTO 1: Instalação - Baixa TODOS os arquivos MP3 na mesma hora para o celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Virty: Baixando mídias e arquivos para uso offline...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// EVENTO 2: Ativação - Limpa registros velhos e assume o controle do app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// EVENTO 3: Busca (Fetch) - Serve os áudios direto do celular, sem gastar internet
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se o áudio ou página já estiver no celular, entrega na hora. Se não, busca na rede.
      return cachedResponse || fetch(event.request);
    })
  );
});
