// /api/statusPod.js

export default async function handler(req, res) {
    const { RUNPOD_API_KEY, POD_ID } = process.env;

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
        res.status(200).json(data.data);
    } catch (error) {
        console.error('Erreur API StatusPod :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
