// scripts/index.js

const container = document.getElementById('characters-container');

characters.forEach(character => {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.onclick = () => chooseCharacter(character.id);

    const img = document.createElement('img');
    img.src = character.image;
    img.alt = character.name;

    const name = document.createElement('h2');
    name.textContent = character.name;

    const desc = document.createElement('p');
    desc.textContent = character.description;

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(desc);
    container.appendChild(card);
});

function chooseCharacter(id) {
    localStorage.setItem('selectedCharacter', id);
    window.location.href = 'chat.html';
}

