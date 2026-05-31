// Escuta as mensagens em segundo plano disparadas pelo Firebase
self.addEventListener('push', function(event) {
    console.log('Mensagem Push recebida em segundo plano.');
    
    let dados = {};
    try {
        dados = event.data.json();
    } catch (e) {
        dados = { 
            title: "VIRTY ACCESS DOOR", 
            body: "Interfone tocando! Clique para atender." 
        };
    }

    const titulo = dados.title || "VIRTY ACCESS DOOR";
    const opcoes = {
        body: dados.body || "Visitante aguardando na portaria.",
        icon: "icone192.png", // CORRIGIDO: Caminho direto para a pasta raiz do visitante
        badge: "icone192.png", // CORRIGIDO: Caminho direto para a pasta raiz do visitante
        vibrate: [500, 300, 500, 300, 500],
        tag: 'virty-chamada',
        renotify: true,
        requireInteraction: true,
        data: { url: './index.html' }
    };

    event.waitUntil(
        self.registration.showNotification(titulo, opcoes)
    );
});

// Quando o morador clica no balão de notificação
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url.includes('morador') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});

// OBRIGATÓRIO PARA PWA: Evento Fetch necessário para o Chrome liberar o botão de instalação
self.addEventListener('fetch', function(event) {
    // Mantém o comportamento padrão de rede, mas preenche o requisito do navegador
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );
});
