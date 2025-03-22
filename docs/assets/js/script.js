
// const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ10@#$%^&*()*&^%αβγΓδ∆εζηθΘλΛμνξΞπΠρσΣτφφΦχ";

// Função para decodificar uma string
function dF(s) {
    // Decodifica a string, removendo o último caractere
    const s1 = unescape(s.substr(0, s.length - 1));
    let t = '';
    
    // Ajusta os caracteres da string decodificada
    for (let i = 0; i < s1.length; i++) {
        t += String.fromCharCode(s1.charCodeAt(i) - s.substr(s.length - 1, 1));
    }
    
    // Escreve o texto decodificado no documento
    document.write(unescape(t));
}

// Configuração do canvas
const c = document.getElementById("dump");
const ctx = c.getContext("2d");
c.height = window.innerHeight;
c.width = window.innerWidth;

// Texto da matriz
const matrix = "Agora você poderia estar em qualquer lugar, fazendo qualquer coisa. Em vez disso está sozinho diante de uma tela. [...]"; // Texto reduzido para brevidade

// Elementos de controle
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const stopButton = document.getElementById('stop-button');
const textInput = document.getElementById('text');
const speedInput = document.getElementById('speed');

let currentCharacter;
const fontSize = 9; // Tamanho da fonte
const columns = c.width / fontSize; // Número de colunas
const drops = Array(columns).fill(1); // Inicializa as gotas

// Função para desenhar no canvas
function draw() {
    // Cria um efeito de desvanecimento
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);
    
    ctx.fillStyle = "#0F0"; // Cor verde
    ctx.font = `${fontSize}px Arial`; // Define a fonte

    // Desenha os caracteres na tela
    for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reseta a gota se ela ultrapassar a altura do canvas
        if (drops[i] * fontSize > c.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Inicia o loop de desenho
setInterval(draw, 30);

// Adiciona eventos aos botões de controle
playButton.addEventListener('click', () => {
    playText(textInput.value);
});
pauseButton.addEventListener('click', pauseText);
stopButton.addEventListener('click', stopText);
speedInput.addEventListener('input', () => {
    stopText();
    playText(utterance.text.substring(currentCharacter));
});

// Configuração do objeto de fala
const utterance = new SpeechSynthesisUtterance();
utterance.addEventListener('end', () => {
    textInput.disabled = false; // Habilita o campo de texto ao final da fala
});
utterance.addEventListener('boundary', e => {
    currentCharacter = e.charIndex; // Atualiza o índice do caractere atual
});

// Função para reproduzir o texto
function playText(text) {
    if (speechSynthesis.paused && speechSynthesis.speaking) {
        return speechSynthesis.resume(); // Retoma a fala se estiver pausada
    }
    if (speechSynthesis.speaking) return; // Não faz nada se já estiver falando
    utterance.text = text; // Define o texto a ser falado
    utterance.rate = speedInput.value || 1; // Define a velocidade da fala
    textInput.disabled = true; // Desabilita o campo de texto enquanto fala
    speechSynthesis.speak(utterance); // Inicia a fala
}

// Função para pausar a fala
function pauseText() {
    if (speechSynthesis.speaking) speechSynthesis.pause();
}

// Função para parar a fala
function stopText() {
    speechSynthesis.cancel(); // Cancela a fala
    textInput.disabled = false; // Habilita o campo de texto
}