// config.js - COPIE E COLE ISSO EXATAMENTE
const firebaseConfig = {
  apiKey: "AIzaSyDnHzXTN8YgHsJYivJv9yTkc_pnU5E2fME",
  authDomain: "control-door-f501d.firebaseapp.com",
  databaseURL: "https://control-door-f501d-default-rtdb.firebaseio.com",
  projectId: "control-door-f501d",
  storageBucket: "control-door-f501d.firebasestorage.app",
  messagingSenderId: "590100166898",
  appId: "1:590100166898:web:b234ee092ec3be2fb2786b"
};

// Inicializa o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
