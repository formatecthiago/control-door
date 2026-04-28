// config.js - DEFINITIVO
const firebaseConfig = {
  apiKey: "AIzaSyDnHzXTN8YgHsJYivJv9yTkc_pnU5E2fME",
  authDomain: "://firebaseapp.com",
  projectId: "control-door-f501d",
  storageBucket: "://appspot.com",
  messagingSenderId: "590100166898",
  appId: "1:590100166898:web:b234ee092ec3be2fb2786b",
  databaseURL: "https://firebaseio.com"
};

// Inicialização segura
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.database();
    console.log("Firebase conectado com sucesso!");
} catch (e) {
    console.error("Erro na inicialização do config.js:", e);
}
