
// auth.js
function gerarIDUnico() {
    return 'dev-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
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
        alert("Sucesso! Celular vinculado à Casa " + casaNumero);
        localStorage.setItem('minha_casa', casaNumero);
        location.reload(); // Recarrega para mostrar o painel de abertura
    })
    .catch((error) => {
        alert("Erro ao salvar: " + error.message);
    });
}
