// Script de Ponte Nativa para Capacitor - Detecção de Chamada da Portaria
document.addEventListener('deviceready', () => {
    console.log("Ambiente nativo Capacitor carregado.");

    // Verifica se o plugin de telefonia está disponível no app compilado
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.PhoneState) {
        const PhoneState = window.Capacitor.Plugins.PhoneState;

        // Escuta mudanças no estado do telefone
        PhoneState.addListener('onPhoneStateChanged', (state) => {
            console.log("Estado da chamada alterado:", state);

            // Se o estado indicar uma chamada recebida (RINGING)
            if (state && (state.state === 'RINGING' || state.value === 'RINGING')) {
                // Aqui você pode opcionalmente filtrar o número da portaria se necessário:
                // if (state.incomingNumber === 'SEU_NUMERO_AQUI') {
                
                console.log("Chamada detectada! Acionando a portaria...");
                
                // Dispara o evento que o seu index.html já está escutando
                window.dispatchEvent(new CustomEvent('portariaChamando'));
                
                // }
            }
        });
    } else {
        console.log("Plugin PhoneState aguardando ambiente nativo.");
    }
}, false);
