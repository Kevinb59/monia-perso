// scripts/connect.js

const connectButton = document.getElementById('connect-btn');
let isConnected = false;

connectButton.addEventListener('click', async () => {
    if (!isConnected) {
        isConnected = true;
        connectButton.textContent = 'Connecté';
        connectButton.classList.add('connected');
    } else {
        isConnected = false;
        connectButton.textContent = 'Déconnecté';
        connectButton.classList.remove('connected');
    }
});
