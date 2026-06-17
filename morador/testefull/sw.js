// Escuta o comando de áudio e injeta a Notificação no topo do celular
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'criar_notificacao_virty') {
    
    const options = {
      body: '⚠️ Visitante tocando o interfone da sua unidade!',
      icon: '../41554.png', // Ícone do seu app
      badge: '../41554.png', // Ícone pequeno da barra de status
      vibrate: [500, 300, 500, 300, 500],
      tag: 'chamada-virty-permanente', // Tag única para não duplicar
      renotify: true,
      requireInteraction: true, // Torna a notificação PERSISTENTE (não some sozinha)
      actions: [
        { action: 'atender', title: '🟢 ATENDER', icon: '' },
        { action: 'recusar', title: '🔴 RECUSAR', icon: '' }
      ]
    };

    self.registration.showNotification('VIRTY: NOVA CHAMADA!', options);
  }
});

// Escuta os cliques nos botões da barra de notificação do topo do celular
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Fecha a notificação automaticamente após o clique

  if (event.action === 'atender') {
    // Abre o PWA ou foca na aba caso já esteja aberta
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        for (let client of windowClients) {
          if ('focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('./index.html');
      })
    );
  } else if (event.action === 'recusar') {
    // Aqui no futuro enviaremos o comando de recusar para o Firebase
    console.log('Chamada recusada pelo topo da tela.');
  }
});
