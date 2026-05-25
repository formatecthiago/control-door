//importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

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
        icon: "../icone192.png",
        badge: "../icone192.png",
        vibrate: [500, 300, 500, 300, 500], // Força o celular a chacoalhar no bolso
        tag: 'virty-chamada',
        renotify: true,
        requireInteraction: true, // Mantém o balão na tela até o morador clicar
        data: { url: './index.html' } // Caminho que vai abrir ao clicar
    };

    event.waitUntil(
        self.registration.showNotification(titulo, opcoes)
    );
});

// Quando o morador clica no balão de notificação, abre o app direto na tela de atendimento
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Se o app já estiver aberto em alguma aba perdida, foca nela
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url.includes('morador') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Se estiver 100% fechado, abre o aplicativo do morador na hora
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});
