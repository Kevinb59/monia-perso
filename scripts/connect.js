// /scripts/connect.js

const connectButton = document.getElementById('connect-btn');
let isConnected = false;

// Fonction simple pour temporiser
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

connectButton.addEventListener('click', async () => {
    if (connectButton.disabled) return; // Sécurité anti-multi-clics

    connectButton.disabled = true;
    connectButton.innerHTML = '<span class="loader"></span> Traitement...';

    try {
        if (!isConnected) {
            await startPod();
            await delay(3000); // Attend un peu que Runpod initialise bien
        } else {
            await stopPod();
            await delay(3000); // Pareil après un arrêt
        }
        await checkPodStatus();
    } catch (error) {
        console.error('Erreur bouton Pod :', error);
        connectButton.innerHTML = 'Erreur';
        connectButton.classList.remove('connected', 'disconnected');
    } finally {
        connectButton.disabled = false;
    }
});

async function startPod() {
    await fetch('/api/startPod', { method: 'POST' });
}

async function stopPod() {
    await fetch('/api/stopPod', { method: 'POST' });
}

async function checkPodStatus() {
    try {
        const response = await fetch('/api/statusPod', { method: 'GET' });
        const data = await response.json();

        const podStatus = data.status || data.podStatus || 'STOPPED';

        if (podStatus === 'RUNNING') {
            isConnected = true;
            connectButton.innerHTML = '🟢 Connecté';
            connectButton.classList.add('connected');
            connectButton.classList.remove('disconnected');
        } else {
            isConnected = false;
            connectButton.innerHTML = '🔴 Déconnecté';
            connectButton.classList.add('disconnected');
            connectButton.classList.remove('connected');
        }
    } catch (error) {
        console.error('Erreur vérification statut Pod :', error);
        connectButton.innerHTML = 'Erreur';
        connectButton.classList.remove('connected', 'disconnected');
    }
}

// Au chargement de la page, on vérifie l'état automatiquement
checkPodStatus();
