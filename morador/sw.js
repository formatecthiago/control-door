// Importa o SDK do Firebase diretamente para dentro do Service Worker
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js');

// Configuração idêntica à do seu arquivo principal
const firebaseConfig = {
    apiKey: "AIzaSyCyOvvGYTCe6EBb8BC20-oHW6ClWYJZFiM",
    databaseURL: "https://virty-access-door-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Variável para controlar se a notificação já está ativa e evitar loops
let notificacaoAtiva = false;

// O Service Worker assume a responsabilidade de escutar o Firebase mesmo com o app fechado!
self.addEventListener('activate', event => {
    event.waitUntil(
        // Substitua 'TESTE_CASA' pela lógica dinâmica ou deixe rodar global temporariamente para o seu teste
        db.ref('chamadas_ativas').on('value', snapshot => {
            const chamadas = snapshot.val();
            if (chamadas) {
                // Percorre as unidades para ver se alguma está chamando
                Object.keys(chamadas).forEach(unidade => {
                    const dados = chamadas[unidade];
                    if ((dados.status === 'chamando' || dados.status === 'escrevendo') && !notificacaoAtiva) {
                        notificacaoAtiva = true;
                        
                        // Força o disparo da notificação nativa com vibração pesada
                        self.registration.showNotification('VIRTY: Chamada Ativa!', {
                            body: `Unidade ${unidade} - Toque para atender o visitante`,
                            icon: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
                            badge: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
                            tag: 'virty-interfone-alerta',
                            renotify: true,
                            requireInteraction: true,
                            vibrate: [500, 200, 500, 200, 500, 200, 500, 200, 500] // Vibração contínua de chamada
                        });
                    }
                });
            } else {
                notificacaoAtiva = false;
            }
        })
    );
});

// Ouve o clique na notificação para abrir ou focar no PWA do morador
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    notificacaoAtiva = false;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let client of clientList) {
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
