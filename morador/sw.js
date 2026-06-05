importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js');

const firebaseConfig = {
    apiKey: "AIzaSyCyOvvGYTCe6EBb8BC20-oHW6ClWYJZFiM",
    databaseURL: "https://virty-access-door-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

let unidadeMonitorada = null;
let ultimaNotificacaoTs = 0;

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.open('virty-config').then(cache => {
            return cache.match('unidade').then(response => {
                if (response) {
                    return response.text().then(un => {
                        unidadeMonitorada = un;
                        inicializarEscutaMestre(un);
                    });
                }
            });
        })
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SET_UNIDADE') {
        const un = event.data.unidade;
        unidadeMonitorada = un;
        caches.open('virty-config').then(cache => {
            cache.put('unidade', new Response(un));
        });
        inicializarEscutaMestre(un);
    }
});

function inicializarEscutaMestre(unidade) {
    if (!unidade) return;

    db.ref('chamadas_ativas/' + unidade).on('value', snapshot => {
        const dados = snapshot.val();
        
        if (dados && dados.status === 'chamando') {
            const agora = Date.now();
            if (agora - ultimaNotificacaoTs < 5000) return; 
            ultimaNotificacaoTs = agora;

            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
                const appVisivel = clientList.some(c => c.visibilityState === 'visible');
                
                // Se o app já está visível em primeiro plano, deixa o banner em tempo real do HTML agir
                if (appVisivel) return;

                const title = '🚨 INTERFONE VIRTY';
                const options = {
                    body: `CHAMADA ATIVA NA PORTARIA!\nToque para abrir o painel de atendimento.`,
                    icon: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
                    badge: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
                    tag: 'virty-push-urgente',
                    renotify: true,
                    requireInteraction: true, 
                    vibrate: [500, 300, 500, 300, 500, 300, 500],
                    actions: [
                        {
                            action: 'abrir_painel',
                            title: '🟢 ATENDER CHAMADA',
                            icon: 'https://placehold.co/96x96/000000/39FF14?text=✓'
                        }
                    ]
                };

                self.registration.showNotification(title, options);
            });
        }
    });
}

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
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
