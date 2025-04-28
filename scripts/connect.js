// /scripts/connect.js

const connectButton = document.getElementById('connect-btn');
let isConnected = false;

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

connectButton.addEventListener('click', async () => {
    if (connectButton.disabled) return;

    connectButton.disabled = true;
    connectButton.innerHTML = '<span class="loader"></span> Traitement...';

    try {
        if (!isConnected) {
            await startPod();
        } else {
            await stopPod();
        }

        await delay(3000); // Petite pause pour laisser RunPod se mettre à jour
        await checkPodStatus();
    } catch (error) {
        console.error('Erreur de connexion/déconnexion Pod :', error);
        connectButton.textContent = 'Erreur';
        connectButton.classList.remove('connected', 'disconnected');
    } finally {
        connectButton.disabled = false;
    }
});

async function startPod() {
    const response = await fetch('/api/startPod', { method: 'POST' });
    if (!response.ok) {
        throw new Error('Erreur au démarrage du Pod.');
    }
}

async function stopPod() {
    const response = await fetch('/api/stopPod', { method: 'POST' });
    if (!response.ok) {
        throw new Error('Erreur à l\'arrêt du Pod.');
    }
}

async function checkPodStatus() {
    try {
        const response = await fetch('/api/statusPod', { method: 'GET' }); // <- Correct ici : méthode GET
        if (!response.ok) {
            throw new Error('Erreur lors de la vérification du statut.');
        }
        const data = await response.json();
        const podStatus = data.status || data.podStatus || 'STOPPED'; // pour gérer les deux cas

        if (podStatus === 'RUNNING') {
            isConnected = true;
            connectButton.textContent = 'Connecté';
            connectButton.classList.add('connected');
            connectButton.classList.remove('disconnected');
        } else {
            isConnected = false;
            connectButton.textContent = 'Déconnecté';
            connectButton.classList.add('disconnected');
            connectButton.classList.remove('connected');
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du statut du Pod :', error);
        connectButton.textContent = 'Erreur';
        connectButton.classList.remove('connected', 'disconnected');
    }
}

// Vérifie l'état du Pod au chargement
checkPodStatus();
