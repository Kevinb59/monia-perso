// /api/startPod.js

export default async function handler(req, res) {
    const { RUNPOD_API_KEY, POD_ID } = process.env;

    if (!RUNPOD_API_KEY || !POD_ID) {
        return res.status(500).json({ error: 'RUNPOD_API_KEY ou POD_ID non défini dans les variables d’environnement.' });
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
        res.status(200).json(data);
    } catch (error) {
        console.error('Erreur API Start Pod:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
