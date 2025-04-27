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
    const response = await fetch(`https://api.runpod.io/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RUNPOD_API_KEY}`
        },
        body: JSON.stringify({
            query: `
                mutation {
                    podResume(input: { podId: "${POD_ID}" }) {
                        id
                        status
                    }
                }
            `
        })
    });
    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);
}

async function stopPod() {
    const response = await fetch(`https://api.runpod.io/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RUNPOD_API_KEY}`
        },
        body: JSON.stringify({
            query: `
                mutation {
                    podStop(input: { podId: "${POD_ID}" }) {
                        id
                        status
                    }
                }
            `
        })
    });
    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);
}
