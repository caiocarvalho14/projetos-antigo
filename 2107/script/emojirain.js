const emojiContainer = document.getElementById('emoji-container'); // Cache do container
let lastScrollY = 0; // Variável para armazenar a última posição de scroll

const emojiCreationInterval = 40; // Crie um emoji a cada 30 frames (ajuste conforme desejado)

function createEmoji() {
    const emoji = document.createElement('div');
    emoji.classList.add('emoji');

    updateEmojiContent(emoji, lastScrollY);

    emojiContainer.appendChild(emoji);

    emoji.style.left = Math.random() * window.innerWidth + 'px';
    emoji.style.fontSize = Math.random() * 40 + 20 + 'px';
    emoji.style.animationDuration = Math.random() * 5 + 2 + 's';

    // Adiciona uma inclinação aleatória
    const randomRotation = Math.random() * 30 - 15; // Gera um ângulo entre -15 e +15 graus
    emoji.style.transform = `rotate(${randomRotation}deg)`;

    // Remover emoji após a animação (ajuste conforme a duração da animação em CSS)
    setTimeout(() => emoji.remove(), 7000);
    checkEmojiVisibility(emoji);
}

function updateEmojiContent(emoji, scrollY) {
    if (scrollY < 600) {
        emoji.textContent = '🎂';
    } else if (scrollY < 1200) {
        emoji.textContent = '⏳';
    } else if (scrollY < 1800) {
        emoji.textContent = '💞';
    } else {
        emoji.textContent = '💗';
    }
}

let frameCount = 0; // Controla a frequência de criação de emojis

function animateEmojis() {
    // Cria emojis em intervalos definidos
    if (frameCount % emojiCreationInterval === 0) {
        createEmoji();
    }
    frameCount++;
    requestAnimationFrame(animateEmojis);
}

animateEmojis(); // Inicia a animação

// ... (resto do código)
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Atualiza emojis apenas se o scroll mudou significativamente (ajuste o valor 50 conforme necessário)
    if (Math.abs(scrollY - lastScrollY) > 50) {
        const emojis = document.querySelectorAll('.emoji');
        emojis.forEach(emoji => updateEmojiContent(emoji, scrollY));
        lastScrollY = scrollY;
    }
});

// Remove emojis que estão fora da tela
function checkEmojiVisibility(emoji) {
    const rect = emoji.getBoundingClientRect();
    const isVisible = (
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth &&
        rect.bottom > 0 &&
        rect.right > 0
    );

    if (!isVisible) {
        emoji.remove();
    } else {
        // Se estiver visível, agende a próxima verificação após um tempo (opcional)
        setTimeout(() => checkEmojiVisibility(emoji), 1000); // Verifica novamente após 1 segundo
    }
}
