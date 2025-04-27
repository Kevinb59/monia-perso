let character;
let chatContainer;

document.addEventListener("DOMContentLoaded", () => {
    character = JSON.parse(localStorage.getItem("currentCharacter"));
    if (!character) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("character-name").textContent = character.name;
    chatContainer = document.getElementById("chat-container");

    loadHistory();
    setupForm();
    setupButtons();
});

function setupForm() {
    const form = document.getElementById("chat-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("chat-input");
        const message = input.value.trim();
        if (!message) return;
        addMessage("user", message);
        input.value = "";
        await sendMessage(message);
    });
}

function setupButtons() {
    document.getElementById("back-button").addEventListener("click", () => {
        window.location.href = "index.html";
    });
    document.getElementById("stop-button").addEventListener("click", () => {
        alert("Session terminée. Ferme ton Pod manuellement si besoin.");
    });
}

function addMessage(sender, text) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${sender}`;
    messageEl.textContent = text;
    chatContainer.appendChild(messageEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    saveHistory(sender, text);
}

async function sendMessage(userMessage) {
    addMessage("ai", "...");
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            model: "llama3",
            messages: buildMessages(userMessage),
            stream: true
        })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiMessage = "";

    const lastBubble = chatContainer.querySelector(".message.ai:last-child");
    lastBubble.textContent = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiMessage += decoder.decode(value, { stream: true });
        lastBubble.textContent = aiMessage;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function buildMessages(userMessage) {
    const history = JSON.parse(localStorage.getItem(`history_${character.id}`)) || [];
    const systemPrompt = { role: "system", content: character.prompt };
    const messages = [systemPrompt, ...history.map(item => ({ role: item.sender, content: item.text })), { role: "user", content: userMessage }];
    return messages;
}

function saveHistory(sender, text) {
    const historyKey = `history_${character.id}`;
    let history = JSON.parse(localStorage.getItem(historyKey)) || [];
    history.push({ sender, text });
    localStorage.setItem(historyKey, JSON.stringify(history));
}

function loadHistory() {
    const historyKey = `history_${character.id}`;
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    history.forEach(msg => addMessage(msg.sender, msg.text));
}
