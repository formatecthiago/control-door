// auth.js
function obterIdentidadeAparelho() {
    let id = localStorage.getItem('control_door_token');
    if (!id) {
        id = 'dev-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('control_door_token', id);
    }
    return id;
}

function registrarNoSistema(casaNumero) {
    const meuID = obterIdentidadeAparelho();
    if (!db) { alert("Erro: Banco de dados não conectado."); return; }

    db.ref('moradores/casa_' + casaNumero + '/' + meuID).set({
        registradoEm: firebase.database.ServerValue.TIMESTAMP,
        ativo: true
    })
    .then(() => {
        localStorage.setItem('minha_casa', casaNumero);
        alert("Sucesso! Este celular agora é a chave da Casa " + casaNumero);
        location.reload();
    })
    .catch((error) => {
        alert("Erro ao salvar: " + error.message);
    });
}
