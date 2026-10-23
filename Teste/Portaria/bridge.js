// Script de Ponte Nativa para Capacitor - Detecção de Chamada da Portaria
document.addEventListener('deviceready', () => {
    console.log("Ambiente nativo Capacitor carregado.");

    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.PhoneState) {
        const PhoneState = window.Capacitor.Plugins.PhoneState;

        // Número oficial da portaria cadastrado
        const NUMERO_PORTARIA = "084988040811";

        PhoneState.addListener('onPhoneStateChanged', (state) => {
            console.log("Estado da chamada alterado:", state);

            if (state && (state.state === 'RINGING' || state.value === 'RINGING')) {
                const numeroChegando = state.incomingNumber || state.number || "";

                // Remove caracteres especiais caso venham formatados (ex: traços ou espaços)
                const numeroLimpo = numeroChegando.replace(/\D/g, '');

                console.log("Chamada recebida de:", numeroLimpo);

                // Compara com o número da portaria cadastrado
                if (numeroLimpo.includes(NUMERO_PORTARIA)) {
                    console.log("Portaria identificada! Acionando alarme e vídeo...");
                    
                    // Dispara o evento capturado pelo index.html
                    window.dispatchEvent(new CustomEvent('portariaChamando'));
                }
            }
        });
    } else {
        console.log("Plugin PhoneState aguardando ambiente nativo.");
    }
}, false);
