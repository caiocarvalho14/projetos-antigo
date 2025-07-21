
// FIM EMOJIS CHUVA
// CONTADOR DE TEMPO
function atualizarContador() {
    const dataInicial = new Date('2024-07-21T00:00:00');
    const agora = new Date();

    const diferencaEmMilissegundos = agora - dataInicial;

    const totalDias = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencaEmMilissegundos % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencaEmMilissegundos % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencaEmMilissegundos % (1000 * 60)) / 1000);

    document.getElementById('contador').innerHTML =
        `Fazem <span class="numero">${totalDias}</span> dias, 
         <span class="numero">${horas}</span> horas, 
         <span class="numero">${minutos}</span> minutos e 
         <span class="numero">${segundos}</span> segundos que dois caminhos viraram um só...`;
}

// FIM CONTADOR DE TEMPO

// TYPER
const textos = [
    "Feliz 1 ano de namoro, minha metade!",
    "Obrigado por cada momento ao seu lado.",
    "Que venham muitos outros anos juntos.",
    "Espero que tenha gostado da surpresa!",
    "Eu te amo mais que tudo. ❤️"
];
const elemento = document.getElementById("typer");

let fraseIndex = 0;
let i = 0;
let apagando = false;

function escrever() {
    const textoAtual = textos[fraseIndex];

    if (!apagando) {
        // Escrevendo
        elemento.innerHTML += textoAtual.charAt(i);
        i++;
        if (i < textoAtual.length) {
            setTimeout(escrever, 60);
        } else {
            // Terminou de escrever, espera e começa a apagar
            setTimeout(() => {
                apagando = true;
                escrever();
            }, 2500);
        }
    } else {
        // Apagando
        elemento.innerHTML = textoAtual.substring(0, i - 1);
        i--;
        if (i > 0) {
            setTimeout(escrever, 50);
        } else {
            // Terminou de apagar, passa para a próxima frase
            apagando = false;
            fraseIndex = (fraseIndex + 1) % textos.length; // Cicla para a próxima frase
            setTimeout(escrever, 100);
        }
    }
}

escrever();


// CHAMAR FUNCOES


setInterval(atualizarContador, 1000);
atualizarContador();