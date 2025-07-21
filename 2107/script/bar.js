
document.addEventListener('DOMContentLoaded', () => {
    // Seu código existente em script.js pode estar aqui...

    const mosaicoElement = document.querySelector('.mosaico');
    const timelineContainer = document.getElementById('mosaico-timeline-container');
    const timelineBar = document.getElementById('mosaico-timeline-bar');

    if (!mosaicoElement || !timelineContainer || !timelineBar) {
        // console.warn('Elementos da linha do tempo do mosaico não encontrados. A funcionalidade não estará ativa.');
        if (timelineContainer) {
            timelineContainer.style.display = 'none'; // Esconde se o contêiner existir mas outros não
        }
        return;
    }

    function updateMosaicoTimeline() {
        const mosaicoRect = mosaicoElement.getBoundingClientRect(); // Posição e tamanho relativos à viewport
        const mosaicoHeight = mosaicoElement.offsetHeight; // Altura total do elemento mosaico
        // Posição do topo do elemento mosaico em relação ao topo do documento
        const mosaicoDocumentTop = mosaicoElement.offsetTop;

        const scrollY = window.scrollY; // Quanto o usuário já rolou a página verticalmente
        const viewportHeight = window.innerHeight; // Altura da janela de visualização

        let progress = 0; // Default progress

        if (mosaicoHeight > 0) {
            // Ponto de 0% de progresso: topo do .mosaico no topo da viewport
            const scrollYAt0Percent = mosaicoDocumentTop;

            if (mosaicoHeight < viewportHeight) {
                // Elemento é mais curto que a viewport.
                // 100% quando o topo do elemento alcança/passa o topo da viewport,
                // pois nesse momento o final do mosaico já está visível.
                if (scrollY >= scrollYAt0Percent) {
                    progress = 100;
                } else {
                    progress = 0; // Antes do topo alcançar o topo da viewport
                }
            } else {
                // Elemento é mais alto ou da mesma altura que a viewport.
                // Ponto de 100% de progresso: base do .mosaico na base da viewport.
                const scrollYAt100Percent = mosaicoDocumentTop + mosaicoHeight - viewportHeight;

                if (scrollY <= scrollYAt0Percent) {
                    progress = 0;
                } else if (scrollY >= scrollYAt100Percent) {
                    progress = 100;
                } else {
                    // scrollY está entre o ponto de 0% e 100%
                    const scrolledDistanceInActiveZone = scrollY - scrollYAt0Percent;
                    const totalScrollDistanceForProgress = scrollYAt100Percent - scrollYAt0Percent; // Isso é (mosaicoHeight - viewportHeight)
                    // totalScrollDistanceForProgress será > 0 aqui, pois este 'else' só é atingido
                    // se scrollYAt0Percent < scrollY < scrollYAt100Percent, o que implica scrollYAt0Percent < scrollYAt100Percent.
                    progress = (scrolledDistanceInActiveZone / totalScrollDistanceForProgress) * 100;
                }
            }
        } else { // mosaicoHeight é 0
            if (scrollY >= mosaicoDocumentTop) { // Se o topo (efetivamente o elemento) passou o topo da viewport
                timelineBar.style.width = '100%';
            } else {
                timelineBar.style.width = '0%';
            }
        }

        // Garante que o progresso fique entre 0% e 100%
        progress = Math.max(0, Math.min(progress, 100));
        timelineBar.style.width = progress + '%';

        // Controla a visibilidade do contêiner da barra de progresso
        const isMosaicoOnScreen = mosaicoRect.top < viewportHeight && mosaicoRect.bottom > 0;
        if (isMosaicoOnScreen) {
            timelineContainer.style.display = 'block';
        } else {
            timelineContainer.style.display = 'none';
            // A largura da barra já está corretamente definida como 0% ou 100%
            // se estiver fora da tela, devido ao cálculo de progresso e ao clamp.
        }
    }

    // Adiciona listeners para atualizar a barra ao rolar a página ou redimensionar a janela
    window.addEventListener('scroll', updateMosaicoTimeline, { passive: true });
    window.addEventListener('resize', updateMosaicoTimeline);

    // Chama a função uma vez no carregamento para definir o estado inicial
    updateMosaicoTimeline();
});
