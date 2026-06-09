// morador/sw.js - Versão Calibrada para 12 Sons
const NOME_DO_CACHE = 'virty-sons-v2';

// Lista restrita aos seus 12 arquivos reais locais
const ARQUIVOS_PARA_CACHEAR = [
    './',
    './index.html',
    './manifest.json',
    // Gera dinamicamente: ./sound/sound1.mp3 até ./sound/sound12.mp3
    ...Array.from({ length: 12 }, (_, i) => `./sound/sound${i + 1}.mp3`)
];

// INSTALAÇÃO: Armazena os 12 sons direto no celular do morador
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(NOME_DO_CACHE).then(function(cache) {
            console.log('VIRTY PWA: Cacheando os 12 arquivos de som locais...');
            return cache.addAll(ARQUIVOS_PARA_CACHEAR);
        }).then(() => self.skipWaiting())
    );
});

// ATIVAÇÃO: Assume o controle imediato do PWA
self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

// INTERCEPTAÇÃO: Entrega os áudios instantaneamente do cache (Sem gastar internet)
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

// ESCUTA DO GATILHO (PUSH NOTIFICATION) - Quando o app está fechado
self.addEventListener('push', function(event) {
    let dados = { som: "sound1.mp3", unidade: "VIRTY" };
    try { dados = event.data.json(); } catch(e) {}

    const options = {
        body: `⚠️ CHAMADA EM CURSO! Clique aqui para atender imediatamente.`,
        icon: './icon.png', 
        badge: './badge.png',
        tag: 'chamada-virty-urgente',
        renotify: true,
        requireInteraction: true, // ⚠️ OBRIGA O USUÁRIO A CLICAR (Não some da barra)
        vibrate: [600, 300, 600, 300, 600, 300, 600, 300, 600], // Vibração contínua e pesada
        data: { url_destino: self.location.origin + '/morador/index.html' }
    };

    // Alerta sonoro nativo via Push se suportado, senão a vibração estendida assume
    try {
        const audioChamada = new Audio(`./sound/${dados.som}`);
        audioChamada.loop = true;
        audioChamada.play();
        self.audioAtivo = audioChamada;
    } catch (err) {
        console.log("Áudio em BG dependente da abertura da janela.");
    }

    event.waitUntil(self.registration.showNotification(`📞 VIRTY ACCESS DOOR`, options));
});

// CLIQUE NA NOTIFICAÇÃO: Abre o app na hora e desliga o barulho de fundo
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (self.audioAtivo) { try { self.audioAtivo.pause(); } catch(e){} }
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === event.notification.data.url_destino && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(event.notification.data.url_destino);
        })
    );
});
