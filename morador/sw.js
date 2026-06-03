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

// Variável de controle para registrar qual chamada já notificamos (evita loops e spam)
let ultimaChamadaNotificada = null;

// Escuta o Firebase em segundo plano
db.ref('chamadas_ativas').on('value', snapshot => {
    const chamadas = snapshot.val();
    if (!chamadas) {
        ultimaChamadaNotificada = null;
        return;
    }

    // Verifica se há janelas do app abertas e visíveis em primeiro plano
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
        const appAbertoEmPrimeiroPlano = clientList.some(client => client.visibilityState === 'visible');

        // Se o app já está aberto na cara do morador, não faz nada! A sua interface HTML assume.
        if (appAbertoEmPrimeiroPlano) return;

        // Varre as unidades para achar quem está chamando
        Object.keys(chamadas).forEach(unidade => {
            const dados = chamadas[unidade];
            
            if (dados.status === 'chamando') {
                const idChamada = `${unidade}_${dados.timestamp || Date.now()}`;
                
                // Só dispara se for uma nova chamada que ainda não notificamos
                if (ultimaChamadaNotificada !== idChamada) {
                    ultimaChamadaNotificada = idChamada;

                    // CONFIGURAÇÃO EXATA DA NOTIFICAÇÃO COMBINADA
                    const title = 'VIRTY: Chamada Ativa!';
                    const options = {
                        body: `Há um visitante aguardando na portaria.\nToque aqui para abrir o painel de atendimento.`,
                        icon: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
                        badge: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
                        tag: 'virty-chamada-tag', // Substitui a notificação anterior se houver, sem empilhar lixo
                        renotify: true,
                        requireInteraction: true, // Mantém a notificação PRESA na tela até o morador clicar
                        vibrate: [500, 300, 500, 300, 500, 300, 500], // Padrão pesado de vibração/toque
                        data: { unidade: unidade } // Passa o número da casa para o evento de clique
                    };

                    self.registration.showNotification(title, options);
                }
            }
        });
    });
});

// O Clique na Notificação (Exatamente como combinamos: abre o app e deixa ele decidir)
self.addEventListener('notificationclick', event => {
    event.notification.close(); // Fecha o balão imediatamente

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Cenário 1: O app já existe em segundo plano, apenas traz para a frente (Foca)
            for (let client of clientList) {
                if ('focus' in client) {
                    return client.focus();
                }
            }
            // Cenário 2: O app estava totalmente fechado, abre a raiz do PWA do zero
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
