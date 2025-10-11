const elementoNome = document.querySelector('#nome');
const textoParaEscrever = " Caio Carvalho";
// 


// --- VARIÁVEIS DE CONTROLE DE VELOCIDADE ---
const velocidadeEscrita = 40; // Em milissegundos (ms). Quanto MAIOR, mais LENTA a escrita.
const velocidadeApagar = 40; // Em milissegundos (ms). Quanto MAIOR, mais LENTO ao apagar.
const tempoEspera = 2000;      // Em milissegundos (ms). Tempo que o texto fica visível antes de apagar.

function typeWriter(texto, i) {
    if (i < texto.length) {
        elementoNome.innerHTML += texto.charAt(i);
        i++;
        setTimeout(() => typeWriter(texto, i), velocidadeEscrita);
    } else {
        // Quando terminar de escrever, espera um pouco e chama a função para apagar
        setTimeout(eraseWriter, tempoEspera);
    }
}

function eraseWriter() {
    let textoAtual = elementoNome.innerHTML;
    if (textoAtual.length > 0) {
        elementoNome.innerHTML = textoAtual.slice(0, -1);
        setTimeout(eraseWriter, velocidadeApagar);
    } else {
        // Quando terminar de apagar, reinicia o ciclo
        setTimeout(() => typeWriter(textoParaEscrever, 0), 500); // Pequeno delay antes de recomeçar
    }
}

// Inicia o ciclo pela primeira vez
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => typeWriter(textoParaEscrever, 0), 500);
});


// 
const btnTopo = document.getElementById('btnTopo');

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        btnTopo.style.display = 'block';
    } else {
        btnTopo.style.display = 'none';
    }
});
btnTopo.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    const bar = document.getElementById('bar');
    const footer = document.getElementById('footer');
    if (!bar || !footer) return;
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const footerTop = footer.getBoundingClientRect().top + scrollTop;
    const maxScroll = footerTop - windowHeight;
    let scrollPercent = 0;
    if (maxScroll > 0) {
        scrollPercent = (scrollTop / maxScroll) * 100;
        scrollPercent = Math.min(100, Math.max(0, scrollPercent));
    }
    bar.style.width = `${scrollPercent}%`;
});