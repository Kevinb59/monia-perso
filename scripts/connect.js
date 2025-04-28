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

    if (!isConnected) {
        try {
            await startPod();
            await delay(3000);
            await checkPodStatus();
        } catch (error) {
            console.error('Erreur connexion Pod :', error);
        } finally {
            connectButton.disabled = false;
        }
    } else {
        try {
            await stopPod();
            await delay(3000);
            await checkPodStatus();
        } catch (error) {
            console.error('Erreur déconnexion Pod :', error);
        } finally {
            connectButton.disabled = false;
        }
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
        const response = await fetch('/api/statusPod', { method: 'POST' });
        const data = await response.json();

        if (data.status === 'RUNNING') {
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
        console.error('Erreur vérification état Pod :', error);
        connectButton.textContent = 'Erreur';
        connectButton.classList.remove('connected', 'disconnected');
    }
}

// Vérifie l'état du Pod au chargement
checkPodStatus();
