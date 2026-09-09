// Service Worker de Desativação e Limpeza para VIRTY MORADOR APK
const CACHE_NAME = 'virty-v2-disabled';

// Evento de Instalação: Força o novo Service Worker a assumir imediatamente
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Evento de Ativação: Limpa todos os caches antigos e remove este Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    return caches.delete(cache);
                })
            );
        }).then(() => {
            return self.clients.claim();
        }).then(() => {
            return self.registration.unregister();
        })
    );
});

// Evento de Fetch: Repassa todas as requisições direto para a rede sem armazenar em cache
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
