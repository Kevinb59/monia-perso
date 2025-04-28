// /api/statusPod.js

export default async function handler(req, res) {
    const { RUNPOD_API_KEY, POD_ID } = process.env;

    if (!RUNPOD_API_KEY || !POD_ID) {
        console.error('Clé API ou Pod ID manquant.');
        return res.status(500).json({ error: 'Clé API ou Pod ID manquant.' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const response = await fetch('https://api.runpod.io/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RUNPOD_API_KEY}`
            },
            body: JSON.stringify({
                query: `
                    query {
                        pod(podId: "${POD_ID}") {
                            id
                            status
                        }
                    }
                `
            })
        });

        const jsonData = await response.json();

        if (!response.ok || jsonData.errors) {
            console.error('Erreur Runpod API:', jsonData.errors || response.statusText);
            return res.status(500).json({ error: 'Erreur Runpod API' });
        }

        const podStatus = jsonData.data?.pod?.status || 'STOPPED';
        res.status(200).json({ status: podStatus });
    } catch (error) {
        console.error('Erreur interne API StatusPod:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la vérification du statut' });
    }
}
