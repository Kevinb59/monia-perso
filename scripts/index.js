document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("characters");
    characters.forEach(character => {
        const card = document.createElement("div");
        card.className = "character-card";
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <h3>${character.name}</h3>
            <p>${character.description}</p>
        `;
        card.addEventListener("click", () => {
            localStorage.setItem("currentCharacter", JSON.stringify(character));
            window.location.href = "chat.html";
        });
        container.appendChild(card);
    });
});
