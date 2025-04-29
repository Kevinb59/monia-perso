// /scripts/chat.js

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const selectedCharacter = characters.find(c => c.id === localStorage.getItem('selectedCharacter'));
let history = [];

loadHistory();

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    userInput.value = '';

    addLoading();

    try {
        const fullHistory = [
            { role: 'system', content: selectedCharacter.systemPrompt },
            ...history,
            { role: 'user', content: message }
        ];

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral',
                messages: fullHistory,
                stream: false
            })
        });

        if (!response.ok) throw new Error('Erreur de la réponse API');

        const data = await response.json();
        const botMessage = data.choices[0].message.content.trim();

        removeLoading();
        addMessage('bot', botMessage);
    } catch (error) {
        removeLoading();
        addMessage('bot', "Erreur de connexion à l'IA.");
        console.error(error);
    }
}

function addMessage(role, content) {
    const msg = document.createElement('div');
    msg.className = role === 'user' ? 'message user fade-in' : 'message bot fade-in';
    msg.textContent = content;
    chatContainer.appendChild(msg);
    history.push({ role, content });
    saveHistory();
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addLoading() {
    const loading = document.createElement('div');
    loading.className = 'message bot loading fade-in';
    loading.textContent = '...';
    loading.id = 'loading';
    chatContainer.appendChild(loading);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.remove();
}

function saveHistory() {
    localStorage.setItem(`history-${selectedCharacter.id}`, JSON.stringify(history));
}

function loadHistory() {
    const saved = localStorage.getItem(`history-${selectedCharacter.id}`);
    if (saved) {
        history = JSON.parse(saved);
        history.forEach(msg => addMessage(msg.role, msg.content));
    }
}

