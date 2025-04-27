// /api/chat.js

export default async function handler(req, res) {
    const { OLLAMA_URL } = process.env;

    if (!OLLAMA_URL) {
        return res.status(500).json({ error: 'OLLAMA_URL non défini dans les variables d’environnement.' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const response = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erreur réponse Ollama:', errorData);
            return res.status(response.status).send(errorData);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erreur API Chat:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
