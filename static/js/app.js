document.getElementById('sobre-link').addEventListener('click', () => {
    document.getElementById('sobre').scrollIntoView({ behavior: 'smooth' })
})

document.getElementById('habilidades-link').addEventListener('click', () => {
    document.getElementById('habilidades').scrollIntoView({ behavior: 'smooth' })
})

document.getElementById('projetos-link').addEventListener('click', () => {
    document.getElementById('projetos').scrollIntoView({ behavior: 'smooth' })
})

document.getElementById('contato-link').addEventListener('click', () => {
    document.getElementById('contato').scrollIntoView({ behavior: 'smooth' })
})

// Seleciona o botão principal que controla o menu (o "hambúrguer")
const toggleButton = document.querySelector('[data-collapse-toggle="navbar-sticky"]');

// Seleciona o próprio menu, para podermos verificar sua visibilidade de outra forma se necessário
const navbar = document.getElementById('navbar-sticky');

// Seleciona TODOS os links dentro do menu de navegação
const navLinks = navbar.querySelectorAll('li');

// Itera sobre cada link para adicionar um "ouvinte" de clique
navLinks.forEach(link => {
    link.addEventListener('click', () => {
    
        const isMenuOpen = toggleButton.getAttribute('aria-expanded') === 'true';

        // Se (e somente se) o menu estiver aberto, simula um clique no botão para fechá-lo.
        if (isMenuOpen) {
            toggleButton.click();
        }
    });
});
// 
const elementoNome = document.querySelector('#nome');
const textoParaEscrever = " Caio Carvalho.";
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

