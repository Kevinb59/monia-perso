// scripts/connect.js

const connectButton = document.getElementById('connect-btn');
let isConnected = false;

// Dès le chargement de la page, vérifier l'état du Pod
window.addEventListener('DOMContentLoaded', checkPodStatus);

// Action au clic
connectButton.addEventListener('click', async () => {
    if (!isConnected) {
        connectButton.disabled = true;
        connectButton.textContent = 'Connexion...';
        
        try {
            await startPod();
            isConnected = true;
            updateButtonState();
        } catch (error) {
            console.error('Erreur de connexion Pod :', error);
            connectButton.textContent = 'Erreur';
        } finally {
            connectButton.disabled = false;
        }
    } else {
        connectButton.disabled = true;
        connectButton.textContent = 'Déconnexion...';
        
        try {
            await stopPod();
            isConnected = false;
            updateButtonState();
        } catch (error) {
            console.error('Erreur de déconnexion Pod :', error);
            connectButton.textContent = 'Erreur';
        } finally {
            connectButton.disabled = false;
        }
    }
});

async function startPod() {
    const response = await fetch('/api/startPod', {
        method: 'POST',
    });
    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);
}

async function stopPod() {
    const response = await fetch('/api/stopPod', {
        method: 'POST',
    });
    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);
}

async function checkPodStatus() {
    try {
        const response = await fetch('/api/statusPod', {
            method: 'POST',
        });
        const data = await response.json();
        const podStatus = data?.pod?.status || 'STOPPED';

        if (podStatus === 'RUNNING') {
            isConnected = true;
        } else {
            isConnected = false;
        }
        updateButtonState();
    } catch (error) {
        console.error('Erreur lors de la vérification du statut du Pod :', error);
    }
}

function updateButtonState() {
    if (isConnected) {
        connectButton.textContent = 'Connecté';
        connectButton.classList.add('connected');
    } else {
        connectButton.textContent = 'Déconnecté';
        connectButton.classList.remove('connected');
    }
}
