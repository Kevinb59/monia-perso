// scripts/connect.js

const connectButton = document.getElementById('connect-btn');
let isConnected = false;

connectButton.addEventListener('click', async () => {
    if (!isConnected) {
        connectButton.disabled = true;
        connectButton.textContent = 'Connexion...';
        
        try {
            await startPod();
            isConnected = true;
            connectButton.textContent = 'Connecté';
            connectButton.classList.add('connected');
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
            connectButton.textContent = 'Déconnecté';
            connectButton.classList.remove('connected');
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
