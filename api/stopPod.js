// /api/stopPod.js

export default async function handler(req, res) {
    const { RUNPOD_API_KEY, POD_ID } = process.env;

    if (!RUNPOD_API_KEY || !POD_ID) {
        return res.status(500).json({ error: 'Clé API ou Pod ID manquant.' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const response = await fetch(`https://api.runpod.ai/v2/${POD_ID}/pause`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RUNPOD_API_KEY}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Erreur API Runpod:', data);
            return res.status(response.status).json({ error: 'Erreur Runpod: ' + (data.error || 'Erreur inconnue') });
        }

        res.status(200).json({ message: 'Pod arrêté.' });
    } catch (error) {
        console.error('Erreur serveur stopPod:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}
