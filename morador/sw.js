// sw.js - Service Worker do Morador
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

// Escuta a ordem do index.html quando o banco detecta uma chamada ativa
self.addEventListener('message', (event) => {
    const dados = event.data;

    if (dados.tipo === 'NOTIFICAR_CHAMADA') {
        const opcoes = {
            body: `Unidade ${dados.unidade}: ${dados.mensagem}`,
            icon: 'icon.png', // Coloque o caminho do seu ícone se tiver
            vibrate: [500, 300, 500, 300, 500],
            data: { url: './' },
            tag: 'virty-chamada',
            requireInteraction: true // Deixa a notificação travada na tela até ele clicar
        };

        event.waitUntil(
            self.registration.showNotification('🚨 VIRTY: Alguém chamando!', opcoes)
        );
    }

    if (dados.tipo === 'LIMPAR_NOTIFICACOES') {
        event.waitUntil(
            self.registration.getNotifications({ tag: 'virty-chamada' }).then((notificacoes) => {
                notificacoes.forEach(n => n.close());
            })
        );
    }
});

// Abre o aplicativo de volta quando o morador clica na notificação do topo
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url.includes('./') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
