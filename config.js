// config.js - Arquivo de Configuração Central
const firebaseConfig = {
  apiKey: "AIzaSyDnHzXTN8YgHsJYivJv9yTkc_pnU5E2fME",
  authDomain: "://firebaseapp.com",
  projectId: "control-door-f501d",
  storageBucket: "control-door-f501d.firebasestorage.app",
  messagingSenderId: "590100166898",
  appId: "1:590100166898:web:b234ee092ec3be2fb2786b",
  databaseURL: "https://firebaseio.com"
};

// Inicializa o Firebase (usando a versão compat que colocamos no HTML)
firebase.initializeApp(firebaseConfig);

// Cria a conexão com o banco de dados em tempo real
const db = firebase.database();
