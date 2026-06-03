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

// Variável para sabermos qual unidade este aparelho controla (evita olhar o condomínio inteiro)
let minhaUnidadeLocal = null;
let ultimaNotificacaoTs = 0;

// Ouve as mensagens vindas da tela principal (HTML) para descobrir qual é a unidade do morador
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SET_UNIDADE') {
        minhaUnidadeLocal = event.data.unidade;
        inicializarEscutaFirebase(minhaUnidadeLocal);
    }
});

function inicializarEscutaFirebase(unidade) {
    if (!unidade) return;

    // Monitora estritamente a unidade DESTE morador (evita travar o app com dados de vizinhos)
    db.ref('chamadas_ativas/' + unidade).on('value', snapshot => {
        const dados = snapshot.val();
        
        // Se a unidade estiver chamando
        if (dados && dados.status === 'chamando') {
            
            // Debounce: Evita disparar 50 notificações seguidas para a mesma chamada
            const agora = Date.now();
            if (agora - ultimaNotificacaoTs < 5000) return; 
            ultimaNotificacaoTs = agora;

            // Verifica se o app já está aberto na cara do usuário para não duplicar o som
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
                const appVisivel = clientList.some(c => c.visibilityState === 'visible');
                if (appVisivel) return; // Se a tela tá aberta, o seu HTML maravilhoso cuida de tudo

                // 🔔 NOTIFICAÇÃO DIFERENCIADA QUE VOCÊ PEDIU
                const title = '🚨 INTERFONE VIRTY';
                const options = {
                    body: `CHAMADA ATIVA NA PORTARIA!\nAlguém está solicitando acesso à sua unidade.`,
                    icon: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
                    badge: 'https://placehold.co/192x192/000000/39FF14?text=VIRTY',
                    tag: 'virty-alerta-urgente',
                    renotify: true,
                    requireInteraction: true, // Fica travada na tela até o clique
                    vibrate: [600, 300, 600, 300, 600, 300, 600, 300, 600], // Padrão pesado de chamada telefônica
                    
                    // O Botão único diferenciado para ir direto para o aplicativo
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

// Controla o clique na Notificação ou no Botão "ATENDER"
self.addEventListener('notificationclick', event => {
    event.notification.close(); // Fecha o balão de alerta imediatamente

    // Executa a ação de abrir/focar o PWA do morador
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Se o app já estiver aberto em segundo plano, traz ele para a frente
            for (let client of clientList) {
                if ('focus' in client) {
                    return client.focus();
                }
            }
            // Se estava fechado, abre o PWA do zero na raiz
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
