// /api/statusPod.js

export default async function handler(req, res) {
    const { RUNPOD_API_KEY, POD_ID } = process.env;

    if (!RUNPOD_API_KEY || !POD_ID) {
        return res.status(500).json({ error: 'Variables d’environnement manquantes.' });
    }

    if (req.method !== 'POST') {
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

        const data = await response.json();

        if (!data || !data.data || !data.data.pod) {
            return res.status(500).json({ error: 'Impossible de récupérer le statut du Pod.' });
        }

        const podStatus = data.data.pod.status; // RUNNING, PAUSED, EXITED, etc.

        res.status(200).json({ podStatus });
    } catch (error) {
        console.error('Erreur API StatusPod:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
