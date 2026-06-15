const CACHE_NAME = 'virty-cache-v3';

// Lista oficial contendo a pasta correta (sound) e os nomes com dois dígitos
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

// Instalação: Salva os arquivos essenciais e os sons para uso em segundo plano
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Ativação: Limpa caches antigos para evitar travamentos de tela
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estratégia de Rede: Busca sempre o mais recente da internet (Network-First)
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                if (response.status === 200) {
                    let responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(e.request);
            })
    );
});

// NOTIFICAÇÃO PERSISTENTE (Disparada em segundo plano)
self.addEventListener('push', (e) => {
    let data = { title: 'VIRTY ACCESS DOOR', body: 'Alguém está tocando o seu interfone!', som: 'sound01.mp3' };
    
    if (e.data) {
        try { data = e.data.json(); } catch(err) { data.body = e.data.text(); }
    }

    const options = {
        body: data.body,
        icon: './icon-192.png',
        badge: './icon-192.png',
        vibrate: [500, 300, 500, 300, 500],
        tag: 'chamada-interfone-' + data.unidade, // Tag impede notificações duplicadas
        renotify: true,
        requireInteraction: true, // Torna a notificação persistente (só some se o usuário arrastar ou clicar)
        data: {
            url: '/control-door/morador/index.html',
            som_escolhido: data.som // Envia o som customizado recebido do Firebase
        }
    };

    e.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Ação ao clicar na Notificação: Abre o App direto na tela de atendimento
self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Se o app já estiver aberto, foca nele
            for (let client of clientList) {
                if (client.url.includes('/control-door/morador/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Se estiver fechado, abre uma nova janela limpa
            if (clients.openWindow) {
                return clients.openWindow(e.notification.data.url);
            }
        })
    );
});
