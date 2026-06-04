const CACHE_NAME = 'virty-visitante-cache-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// Instalação do Service Worker do Visitante
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Estratégia de Cache-First para os arquivos estáticos enviados pelo usuário
self.addEventListener('fetch', event => {
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('firestore')) {
    return; // Ignora o Firebase para não quebrar o Realtime Database
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Escutador de Push nativo em Background para o ecossistema Virty
self.addEventListener('push', event => {
  let data = { title: 'VIRTY ACCESS', body: 'Chamada recebida na portaria!', unidade: '' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY%0A%20%20V',
    badge: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY%0A%20%20V',
    vibrate: [300, 100, 300, 100, 300],
    tag: 'virty-chamada-geral',
    requireInteraction: true, // Mantém a notificação fixa no topo até o morador agir
    data: { unidade: data.unidade }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ação de clique na notificação para focar ou abrir o painel imediatamente
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUnassigned: true }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});
