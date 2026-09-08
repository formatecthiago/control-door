const CACHE_NAME = 'virty-morador-v2.0.2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
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

// 1. Instalação: Armazena arquivos essenciais em cache para carregamento ultrarrápido
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 2. Ativação: Limpa versões de cache antigas para economizar memória do dispositivo
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. Interceptação de Redes (Fetch): Estratégia Network First com Fallback para Cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições do banco de dados Firebase para não interferir nas chamadas de tempo real
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a requisição foi bem-sucedida, atualiza o cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se estiver offline ou falhar, busca direto do cache
        return caches.match(event.request);
      })
  );
});

// 4. Recebimento de Push Notification em Segundo Plano (Google FCM / WebPush)
self.addEventListener('push', (event) => {
  let data = {
    title: '🚨 CHAMADA NA PORTARIA',
    body: 'Tem alguém tocando o seu interfone!',
    icon: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
    badge: 'https://placehold.co/96x96/000000/39FF14?text=V',
    tag: 'virty-interfone-call',
    sound: 'sound01'
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
    badge: data.badge,
    tag: 'virty-chamada-ativa',
    renotify: true,
    requireInteraction: true, // Mantém a notificação fixa na tela até o morador interagir
    vibrate: [500, 200, 500, 200, 500, 200, 800],
    data: {
      url: '/',
      time: Date.now()
    },
    actions: [
      { action: 'open', title: '📞 ATENDER CHAMADA' },
      { action: 'close', title: '❌ RECUSAR' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. Clique na Notificação: Desperta o aplicativo e abre a tela de chamada
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Procura por abas ou instâncias da WebView que já estejam abertas
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      // Se o aplicativo estiver completamente fechado, força a abertura da janela raiz
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
