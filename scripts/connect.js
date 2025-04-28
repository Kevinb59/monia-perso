// /scripts/connect.js

const connectButton = document.getElementById('connect-btn');
let isConnected = false;

// Petite fonction utilitaire pour attendre un délai
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

connectButton.addEventListener('click', async () => {
    if (connectButton.disabled) return; // Anti-spam clics rapides

    connectButton.disabled = true;
    connectButton.innerHTML = '<span class="loader"></span> Traitement...';

    try {
        if (!isConnected) {
            await startPod();
        } else {
            await stopPod();
        }
        await delay(3000); // Toujours laisser un délai après un start/stop
        await checkPodStatus();
    } catch (error) {
        console.error('Erreur générale bouton Pod :', error);
        showErrorState();
    } finally {
        connectButton.disabled = false;
    }
});

async function startPod() {
    const response = await fetch('/api/startPod', { method: 'POST' });
    if (!response.ok) throw new Error('Erreur lors du démarrage du Pod');
}

async function stopPod() {
    const response = await fetch('/api/stopPod', { method: 'POST' });
    if (!response.ok) throw new Error('Erreur lors de l\'arrêt du Pod');
}

async function checkPodStatus() {
    try {
        const response = await fetch('/api/statusPod', { method: 'GET' });
        if (!response.ok) throw new Error('Erreur serveur lors de la vérification du statut');

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
        console.error('Erreur lors de la vérification du statut du Pod :', error);
        showErrorState();
    }
}

function showErrorState() {
    connectButton.innerHTML = 'Erreur';
    connectButton.classList.remove('connected', 'disconnected');
}
 
// Vérifie immédiatement l'état à l'ouverture
checkPodStatus();
