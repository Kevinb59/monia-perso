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
        const response = await fetch('https://api.runpod.io/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RUNPOD_API_KEY}`,
            },
            body: JSON.stringify({
                query: `
                    mutation {
                        podStop(input: { podId: "${POD_ID}" }) {
                            id
                            desiredStatus
                        }
                    }
                `
            })
        });

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erreur API StopPod:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'arrêt du Pod.' });
    }
}
