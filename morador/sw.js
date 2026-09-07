const CACHE_NAME = 'virty-cache-v3.2';

const urlsToCache = [
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
  './sound/sound12.mp3',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptação de Rede Otimizada (Evita estouro de memória no APK)
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;

    const url = e.request.url;

    // Ignora conexões em tempo real do Firebase e requisições externas para não travar a memória
    if (
        url.includes('firebaseio.com') || 
        url.includes('googleapis.com') || 
        url.includes('google-analytics.com') ||
        url.startsWith('data:') ||
        url.startsWith('blob:')
    ) {
        return;
    }

    // Estratégia: Tenta Rede -> Se falhar, busca no Cache local
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                // Armazena no cache apenas se for arquivo estático local válido
                if (response.status === 200 && response.type === 'basic') {
                    let responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});

// Tratamento de Push Notificação para Heads-up (Banner Flutuante)
self.addEventListener('push', (e) => {
    let data = { title: 'VIRTY ACCESS DOOR', body: 'Alguém está chamando na sua porta!', som: 'sound01' };
    
    if (e.data) {
        try { data = e.data.json(); } catch(err) { data.body = e.data.text(); }
    }

    const options = {
        body: data.body,
        icon: './icon-192.png',
        badge: './icon-192.png',
        vibrate: [1000, 500, 1000, 500, 1000],
        tag: 'chamada-interfone-' + (data.unidade || 'geral'),
        renotify: true,
        requireInteraction: true,
        priority: 'high',
        channelId: 'virty_interfone_channel',
        data: {
            url: './index.html',
            som_escolhido: data.som
        }
    };

    e.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Clique na notificação
self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let client of clientList) {
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
