
//sw.js - Arquivo Service Worker básico
self.addEventListener('fetch', function(event) {
// Apenas uma estrutura para o navegador aceitar como PWA
event.respondWith(fetch(event.request));
});
