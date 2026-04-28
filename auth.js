// auth.js
function obterIdentidadeAparelho() {
    let id = localStorage.getItem('control_door_token');
    if (!id) {
        id = 'token-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('control_door_token', id);
    }
    return id;
}

function registrarNoSistema(casaNumero) {
    if (typeof db === 'undefined') {
        alert("Erro: O Firebase ainda não carregou. Aguarde 2 segundos.");
        return;
    }

    const meuID = obterIdentidadeAparelho();
    db.ref('moradores/casa_' + casaNumero + '/' + meuID).set({
        registradoEm: firebase.database.ServerValue.TIMESTAMP,
        ativo: true
    })
    .then(() => {
        localStorage.setItem('minha_casa', casaNumero);
        alert("CONECTADO COM SUCESSO! Este celular agora é a chave da Casa " + casaNumero);
        location.reload();
    })
    .catch((error) => {
        alert("Erro no Firebase: " + error.message);
    });
}
