// config.js
const firebaseConfig = {
  apiKey: "AIzaSyDnHzXTN8YgHsJYivJv9yTkc_pnU5E2fME",
  authDomain: "://firebaseapp.com",
  projectId: "control-door-f501d",
  storageBucket: "control-door-f501d.firebasestorage.app",
  messagingSenderId: "590100166898",
  appId: "1:590100166898:web:b234ee092ec3be2fb2786b",
  databaseURL: "https://firebaseio.com"
};

// Inicializa o Firebase apenas se ainda não foi inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
