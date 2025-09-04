const cardsContainer = document.getElementById('cards-container');

/**
 * Cria o HTML para um card de evento de Atletismo.
 * @param {Object} event - O objeto do evento de atletismo.
 * @returns {string} O HTML do card de atletismo.
 */
function createAthleticsCard(event) {
    // Cria uma lista de HTML (<li>) para cada participante
    const participantsHtml = event.participantes.map(participant =>
        `<li class="list-group-item bg-transparent border-0 px-1 py-0">${participant}</li>`
    ).join('');

    // Cria um elemento HTML para o vencedor apenas se o campo 'vencedor' existir
    const winnerHtml = event.vencedor ? `
        <div class="mt-3 pt-3 border-top text-center">
            <h6 class="card-subtitle text-muted mb-1">Vencedor(a)</h6>
            <p class="card-text fw-bold text-success">${event.vencedor}</p>
        </div>
    ` : '';

    return `
        <div class="col-md-6 col-lg-4">
            <div class="card shadow-sm game-card">
                <div class="card-header text-center">
                    <span class="text-capitalize fw-bold">Atletismo</span>
                    <span class="text-muted"> - ${event.categoria}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-center mb-3">${event.bateria}</h5>
                    <ul class="list-group list-group-flush text-center small">
                        ${participantsHtml}
                    </ul>
                    ${winnerHtml}
                </div>
                <div class="card-footer text-center text-muted small">
                    ${event.data} - ${event.hora}
                </div>
            </div>
        </div>
    `;
}

/**
 * Cria o HTML para um único card de jogo (Futsal, Vôlei, Queimada, etc.).
 * @param {Object} game - O objeto do jogo com todos os dados já processados.
 * @returns {string} O HTML do card do jogo.
 */
function createGameCard(game) {
    if (game.modalidade === 'atletismo') {
        return createAthleticsCard(game);
    }
    
    const timeA = game.time_a_details;
    const timeB = game.time_b_details;
    const winnerId = game.vencedor;

    const logoA = timeA.logo_dir ? `assets/img/logos/${timeA.logo_dir}` : 'assets/img/placeholder.png';
    const logoB = timeB.logo_dir ? `assets/img/logos/${timeB.logo_dir}` : 'assets/img/placeholder.png';
    
    // MODIFICADO: A cor de vencedor só é aplicada se não for empate
    const cardClassA = timeA.isPlaceholder 
        ? 'bg-secondary-subtle' 
        : (winnerId === timeA.id ? 'bg-success text-white' : 'bg-light');

    const cardClassB = timeB.isPlaceholder 
        ? 'bg-secondary-subtle' 
        : (winnerId === timeB.id ? 'bg-success text-white' : 'bg-light');

    let scoreOrStatusHtml = '';
    let resultTextHtml = '';

    // --- LÓGICA DE EXIBIÇÃO DO RESULTADO MODIFICADA ---
    if (winnerId && winnerId.trim() !== '') {
        // Mostra o placar normalmente para Futsal e Vôlei
        if (game.modalidade === 'futsal' || game.modalidade === 'volei') {
            scoreOrStatusHtml = `<h3 class="mb-0">${game.pontos_a} x ${game.pontos_b}</h3>`;
            if (game.modalidade === 'volei') {
                // ... (lógica dos sets do vôlei, se aplicável)
            }
        } else {
             scoreOrStatusHtml = `<h3 class="mb-0">Finalizado</h3>`;
        }
        
        // Lógica para o texto do resultado
        if (winnerId.toLowerCase() === 'empate') {
            resultTextHtml = `<p class="text-center mt-3 mb-0 fw-bold">Resultado: Empate</p>`;
        } else {
            const winnerName = winnerId === timeA.id ? timeA.nome : timeB.nome;
            resultTextHtml = `<p class="text-center mt-3 mb-0 fw-bold winner-text">Resultado: Vitória de ${winnerName}!</p>`;
        }

    } else { // Jogo ainda não aconteceu
        scoreOrStatusHtml = `
            <h3 class="mb-0">VS</h3>
            <p class="mb-0 small text-muted">${game.data} - ${game.hora}</p>
        `;
        if(!timeA.isPlaceholder && !timeB.isPlaceholder) {
            resultTextHtml = `<p class="text-center mt-3 mb-0 text-muted">Resultado: à definir</p>`;
        }
    }
    // --- FIM DA LÓGICA MODIFICADA ---

    return `
        <div class="col-md-6 col-lg-4">
            <div class="card shadow-sm game-card">
                <div class="card-header text-center">
                    <span class="text-capitalize fw-bold">${game.modalidade.replace('_', ' ')}</span>
                    ${game.fase ? `<span class="text-muted"> - ${game.fase}</span>` : ''}
                    ${(winnerId && winnerId.trim() !== '') ? `<span class="ms-2 text-muted small fw-normal">(${game.data})</span>` : ''}
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-around align-items-center text-center">
                        <div class="team-card flex-fill p-2 rounded ${cardClassA}">
                            <img src="${logoA}" alt="Logo ${timeA.nome}" class="team-logo mb-2">
                            <h5 class="card-title h6">${timeA.nome}</h5>
                        </div>
                        <div class="score-separator px-3">
                           ${scoreOrStatusHtml}
                        </div>
                        <div class="team-card flex-fill p-2 rounded ${cardClassB}">
                            <img src="${logoB}" alt="Logo ${timeB.nome}" class="team-logo mb-2">
                            <h5 class="card-title h6">${timeB.nome}</h5>
                        </div>
                    </div>
                    ${resultTextHtml}
                </div>
            </div>
        </div>
    `;
}


/**
 * Renderiza a lista de jogos no container de cards.
 * @param {Array<Object>} games - A lista de jogos a ser exibida.
 */

export function displayGames(games) {
    cardsContainer.innerHTML = '';
    if (games.length === 0) {
        cardsContainer.innerHTML = '<p class="text-center text-muted">Nenhum jogo encontrado para esta modalidade.</p>';
        return;
    }
    games.forEach(game => {
        const cardHtml = createGameCard(game);
        cardsContainer.innerHTML += cardHtml;
    });
}

/**
 * Atualiza o texto de "Última atualização".
 */

export function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        lastUpdatedElement.textContent = `Atualizado às ${timeString}`;
    }
}