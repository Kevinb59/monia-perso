// /api/chat.js

export default async function handler(req, res) {
    const { OLLAMA_URL } = process.env;

    if (!OLLAMA_URL) {
        return res.status(500).json({ error: 'OLLAMA_URL non configuré' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    try {
        const response = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erreur API Chat:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
