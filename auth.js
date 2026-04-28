function obterIdentidadeAparelho() {
    let id = localStorage.getItem('control_door_token');
    if (!id) {
        id = 'dev-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('control_door_token', id);
    }
    return id;
}

function registrarNoSistema(casaNumero) {
    if (typeof firebase === 'undefined' || typeof db === 'undefined') {
        alert("ERRO: Sistema Firebase ainda não carregou. Tente novamente em 2 segundos.");
        return;
    }

    const meuID = obterIdentidadeAparelho();
    db.ref('moradores/casa_' + casaNumero + '/' + meuID).set({
        registradoEm: firebase.database.ServerValue.TIMESTAMP,
        ativo: true
    })
    .then(() => {
        localStorage.setItem('minha_casa', casaNumero);
        alert("CONECTADO COM SUCESSO!");
        location.reload();
    })
    .catch((error) => alert("Erro ao salvar: " + error.message));
}
