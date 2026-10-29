// Script de Ponte Nativa para Capacitor - Detecção de Chamada da Portaria
document.addEventListener('deviceready', () => {
    console.log("Ambiente nativo Capacitor carregado.");

    // Verifica se a API de telefonia do Cordova/Capacitor está disponível
    if (window.plugins && window.plugins.telephony) {
        window.plugins.telephony.onCall((callState) => {
            console.log("Estado da chamada alterado:", callState);

            // Estados comuns: RINGING (tocando), OFFHOOK (atendida/discando), IDLE (desligada)
            if (callState && (callState.state === 'RINGING' || callState.status === 'RINGING')) {
                const numeroChegando = callState.incomingNumber || callState.number || "";
                const numeroLimpo = numeroChegando.replace(/\D/g, '');

                // Busca o número atual salvo pelo usuário na tela
                const numeroCadastrado = localStorage.getItem('numeroPortariaAlvo') || "084988040811";

                console.log("Chamada recebida de:", numeroLimpo, "| Alvo esperado:", numeroCadastrado);

                if (numeroLimpo.includes(numeroCadastrado) || numeroCadastrado.includes(numeroLimpo)) {
                    console.log("Portaria identificada! Acionando PiP...");
                    window.dispatchEvent(new CustomEvent('portariaChamando'));
                }
            }
        });
    } else {
        console.log("Plugin de telefonia aguardando inicialização nativa.");
    }
}, false);
