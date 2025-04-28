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
        const response = await fetch(`https://api.runpod.ai/v2/${POD_ID}/status`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${RUNPOD_API_KEY}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Erreur Runpod:', data);
            return res.status(response.status).json({ error: 'Erreur lors de la récupération du statut du pod.' });
        }

        res.status(200).json({ status: data.status });
    } catch (error) {
        console.error('Erreur serveur statusPod:', error);
        res.status(500).json({ error: 'Erreur serveur interne.' });
    }
}
