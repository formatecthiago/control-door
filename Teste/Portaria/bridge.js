// Script de Ponte Nativa para Capacitor - Detecção de Chamada da Portaria
document.addEventListener('deviceready', () => {
    console.log("Ambiente nativo Capacitor carregado.");

    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.PhoneState) {
        const PhoneState = window.Capacitor.Plugins.PhoneState;

        PhoneState.addListener('onPhoneStateChanged', (state) => {
            console.log("Estado da chamada alterado:", state);

            if (state && (state.state === 'RINGING' || state.value === 'RINGING')) {
                const numeroChegando = state.incomingNumber || state.number || "";
                const numeroLimpo = numeroChegando.replace(/\D/g, '');

                // Busca o número atual salvo pelo usuário na tela (ou usa o seu padrão se estiver vazio)
                const numeroCadastrado = localStorage.getItem('numeroPortariaAlvo') || "084988040811";

                console.log("Chamada recebida de:", numeroLimpo, "| Alvo esperado:", numeroCadastrado);

                if (numeroLimpo.includes(numeroCadastrado)) {
                    console.log("Portaria identificada! Acionando alarme e vídeo...");
                    window.dispatchEvent(new CustomEvent('portariaChamando'));
                }
            }
        });
    } else {
        console.log("Plugin PhoneState aguardando ambiente nativo.");
    }
}, false);
