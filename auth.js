// auth.js
function obterIdentidadeAparelho() {
    let id = localStorage.getItem('control_door_token');
    if (!id) {
        id = 'tk-' + Math.random().toString(36).substr(2, 5) + '-' + Date.now();
        localStorage.setItem('control_door_token', id);
    }
    return id;
}

function registrarNoSistema(casaNumero) {
    console.log("Botão acionado para casa:", casaNumero);
    
    if (typeof db === 'undefined') {
        alert("Erro: Banco de dados não definido no config.js");
        return;
    }

    const meuID = obterIdentidadeAparelho();
    
    // Tentativa de escrita direta
    db.ref('moradores/casa_' + casaNumero + '/' + meuID).set({
        registradoEm: firebase.database.ServerValue.TIMESTAMP,
        ativo: true
    })
    .then(() => {
        localStorage.setItem('minha_casa', casaNumero);
        alert("SUCESSO! Casa " + casaNumero + " conectada.");
        window.location.reload();
    })
    .catch((error) => {
        console.error(error);
        alert("Erro no Firebase: " + error.message);
    });
}
