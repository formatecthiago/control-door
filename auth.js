// auth.js
function gerarIDUnico() {
    return 'device-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
}

function obterIdentidadeAparelho() {
    let dispositivoID = localStorage.getItem('control_door_token');
    if (!dispositivoID) {
        dispositivoID = gerarIDUnico();
        localStorage.setItem('control_door_token', dispositivoID);
    }
    return dispositivoID;
}

function registrarNoSistema(casaNumero) {
    const meuID = obterIdentidadeAparelho();
    
    db.ref('moradores/casa_' + casaNumero + '/' + meuID).set({
        registradoEm: firebase.database.ServerValue.TIMESTAMP,
        ativo: true
    })
    .then(() => {
        localStorage.setItem('minha_casa', casaNumero);
        alert("✅ Sucesso! Este celular agora é a chave da Casa " + casaNumero);
        location.reload(); 
    })
    .catch((error) => {
        alert("Erro ao registrar: " + error.message);
    });
}
