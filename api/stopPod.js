// /api/stopPod.js

export default async function handler(req, res) {
    const { RUNPOD_API_KEY, POD_ID } = process.env;

    if (!RUNPOD_API_KEY || !POD_ID) {
        return res.status(500).json({ error: 'Clé API ou POD_ID manquant' });
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
                        podStop(input: { podId: "${POD_ID}" }) {
                            id
                            status
                        }
                    }
                `
            })
        });

        const result = await response.json();

        if (result.errors) {
            console.error('Erreur arrêt Pod:', result.errors);
            return res.status(500).json({ error: result.errors[0].message });
        }

        res.status(200).json(result.data.pod);
    } catch (error) {
        console.error('Erreur serveur arrêt Pod:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
