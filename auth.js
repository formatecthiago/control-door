// auth.js - VERSÃO DE DIAGNÓSTICO
function obterIdentidadeAparelho() {
    let id = localStorage.getItem('control_door_token');
    if (!id) {
        id = 'dev-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('control_door_token', id);
    }
    return id;
}

function registrarNoSistema(casaNumero) {
    console.log("Botão clicado! Tentando registrar casa:", casaNumero);
    
    const meuID = obterIdentidadeAparelho();
    console.log("ID do aparelho gerado:", meuID);

    // Verifica se o Firebase/Banco de dados foi carregado pelo config.js
    if (typeof firebase === 'undefined') {
        alert("ERRO: O script do Firebase não foi carregado no HTML!");
        return;
    }
    
    if (typeof db === 'undefined') { 
        alert("ERRO: O arquivo config.js não inicializou o banco de dados 'db'!"); 
        return; 
    }

    console.log("Enviando dados para o Firebase...");

    db.ref('moradores/casa_' + casaNumero + '/' + meuID).set({
        registradoEm: firebase.database.ServerValue.TIMESTAMP,
        ativo: true
    })
    .then(() => {
        console.log("Sucesso no Firebase!");
        localStorage.setItem('minha_casa', casaNumero);
        alert("CONECTADO COM SUCESSO!");
        location.reload();
    })
    .catch((error) => {
        console.error("Erro detalhado do Firebase:", error);
        alert("O FIREBASE REJEITOU: " + error.message);
    });
}
