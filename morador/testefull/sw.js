const CACHE_NAME = 'virty-teste-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sound/sound01.mp3'
];

// Instalação do Cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// O PULO DO GATO: Simulação de Push Notification / Chamada Externa
// Quando o Service Worker interceptar um comando ou você disparar uma notificação de teste:
self.addEventListener('push', e => {
  const options = {
    body: '⚠️ Teste de Chamada Virty Interno',
    icon: './icon-192.png',
    vibrate: [500, 300, 500],
    tag: 'chamada-teste',
    renotify: true,
    data: { url: './index.html' }
  };

  e.waitUntil(
    self.registration.showNotification('VIRTY TESTE', options).then(() => {
      // Procura a aba do app aberta para forçar o áudio
      return clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        for (let client of windowClients) {
          // Envia uma mensagem direta para o index.html executar a função testarAudioLocal()
          client.postMessage({ action: 'tocar_som_pwa' });
        }
      });
    })
  );
});
