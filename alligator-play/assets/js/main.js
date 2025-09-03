import { fetchGamesData } from './api.js';
import { displayGames, updateLastUpdated } from './ui.js';

let allGames = [];
let allTeams = []; // Vamos guardar a lista de times aqui

/**
 * Calcula a classificação de um grupo com base nos resultados dos jogos.
 * @param {string} group - O nome do grupo a ser calculado.
 * @param {Array<Object>} allGamesInSport - Lista de todos os jogos da modalidade.
 * @returns {Array<Object>} Uma lista ordenada de times com suas estatísticas.
 */
function calculateStandings(group, allGamesInSport) {
    // 1. Filtra apenas os jogos da fase de grupos que já terminaram
    const groupGames = allGamesInSport.filter(
        game => game.grupo === group && game.fase === 'Grupos' && game.vencedor
    );

    // 2. Inicializa a tabela de classificação para cada time
    const standings = {};
    groupGames.forEach(game => {
        if (!standings[game.time_a]) {
            standings[game.time_a] = { teamId: game.time_a, pontos: 0, saldoGols: 0, golsPro: 0 };
        }
        if (!standings[game.time_b]) {
            standings[game.time_b] = { teamId: game.time_b, pontos: 0, saldoGols: 0, golsPro: 0 };
        }
    });

    // 3. Itera sobre os jogos e calcula os pontos e saldos de gols
    groupGames.forEach(game => {
        const scoreA = parseInt(game.pontos_a, 10);
        const scoreB = parseInt(game.pontos_b, 10);
        const teamA = game.time_a;
        const teamB = game.time_b;

        // Adiciona gols e saldo de gols (verifica se o placar é um número)
        if (!isNaN(scoreA) && !isNaN(scoreB)) {
            standings[teamA].golsPro += scoreA;
            standings[teamB].golsPro += scoreB;
            standings[teamA].saldoGols += (scoreA - scoreB);
            standings[teamB].saldoGols += (scoreB - scoreA);
        }

        // Adiciona pontos (3 para vitória, 1 para empate)
        if (scoreA > scoreB) {
            standings[teamA].pontos += 3;
        } else if (scoreB > scoreA) {
            standings[teamB].pontos += 3;
        } else {
            standings[teamA].pontos += 1;
            standings[teamB].pontos += 1;
        }
    });

    // 4. Converte para array e ordena pelos critérios de desempate
    const rankedTeams = Object.values(standings).sort((a, b) => {
        // Critério 1: Pontos (do maior para o menor)
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        // Critério 2: Saldo de Gols (do maior para o menor)
        if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
        // Critério 3: Gols Pró (do maior para o menor)
        return b.golsPro - a.golsPro;
    });

    return rankedTeams;
}

/**
 * Processa todos os dados brutos das planilhas para prepará-los para exibição.
 * @param {Object} data - O objeto contendo os dados de todas as planilhas.
 * @returns {Array<Object>} Uma lista única e processada de todos os jogos e eventos.
 */
function processData(data) {
    const { times, futsal, volei, queimada, atletismo, cabo_de_guerra } = data;
    
    allTeams = times; // Guarda a lista de times para usar depois no filtro

    const normalizeWinner = (game) => {
        const winnerValue = game.vencedor?.toUpperCase();
        if (winnerValue === 'A') {
            game.vencedor = game.time_a;
        } else if (winnerValue === 'B') {
            game.vencedor = game.time_b;
        }
    };
    futsal.forEach(normalizeWinner);
    volei.forEach(normalizeWinner);
    queimada.forEach(normalizeWinner);
    cabo_de_guerra.forEach(normalizeWinner);
    
    const teamsMap = times.reduce((map, team) => {
        map[team.id] = team;
        return map;
    }, {});

    const allSportsGames = { futsal, volei, queimada, atletismo, cabo_de_guerra };
    const rankingsCache = new Map();

    const getTeamDetails = (teamId, currentGame, modalidade) => {
        if (typeof teamId !== 'string' || !teamId) return teamsMap[teamId];

        if (teamId.startsWith('M_')) {
            const rankPosition = parseInt(teamId.split('_')[1], 10);
            const group = currentGame.grupo;
            const cacheKey = `${modalidade}_${group}`;

            if (!rankingsCache.has(cacheKey)) {
                const allGamesInSport = allSportsGames[modalidade] || [];
                const ranking = calculateStandings(group, allGamesInSport);
                rankingsCache.set(cacheKey, ranking);
            }
            const groupRanking = rankingsCache.get(cacheKey);

            if (groupRanking && groupRanking[rankPosition - 1]) {
                const rankedTeamId = groupRanking[rankPosition - 1].teamId;
                return teamsMap[rankedTeamId];
            } else {
                return { id: teamId, nome: `${rankPosition}º Classificado`, logo_dir: '', isPlaceholder: true };
            }
        }

        if (teamId.startsWith('V_')) {
            const gameId = teamId.split('_')[1];
            const allGamesInSport = allSportsGames[modalidade] || [];
            const referencedGame = allGamesInSport.find(g => g.id === gameId);

            if (referencedGame && referencedGame.vencedor) {
                return teamsMap[referencedGame.vencedor];
            } else {
                return { id: teamId, nome: `Vencedor Jogo ${gameId}`, logo_dir: '', isPlaceholder: true };
            }
        }
        
        if (teamId.startsWith('P_')) {
            const gameId = teamId.split('_')[1];
            const allGamesInSport = allSportsGames[modalidade] || [];
            const referencedGame = allSportsGames[modalidade].find(g => g.id === gameId);

            if (referencedGame && referencedGame.vencedor) {
                const winnerId = referencedGame.vencedor;
                const loserId = winnerId === referencedGame.time_a ? referencedGame.time_b : referencedGame.time_a;
                return teamsMap[loserId];
            } else {
                return { id: teamId, nome: `Perdedor Jogo ${gameId}`, logo_dir: '', isPlaceholder: true };
            }
        }

        return teamsMap[teamId];
    };
    
    const enrichGame = (game, modalidade) => {
        if (modalidade === 'atletismo') {
            return {
                ...game,
                modalidade: 'atletismo',
                participantes: game.participantes ? game.participantes.split(';').map(p => p.trim()) : [],
                vencedor: game.vencedor || null
            };
        }

        const time_a_details = getTeamDetails(game.time_a, game, modalidade);
        const time_b_details = getTeamDetails(game.time_b, game, modalidade);

        if (time_a_details && time_b_details) {
            return { ...game, modalidade, time_a_details, time_b_details };
        }
        return null;
    };
    
    const futsalGames = futsal.map(game => enrichGame(game, 'futsal')).filter(Boolean);
    const voleiGames = volei.map(game => enrichGame(game, 'volei')).filter(Boolean);
    const queimadaGames = queimada.map(game => enrichGame(game, 'queimada')).filter(Boolean);
    const atletismoEvents = atletismo.map(event => enrichGame(event, 'atletismo')).filter(Boolean);
    const caboDeGuerraGames = cabo_de_guerra.map(game => enrichGame(game, 'cabo_de_guerra')).filter(Boolean);

    const combinedGames = [...futsalGames, ...voleiGames, ...queimadaGames, ...atletismoEvents, ...caboDeGuerraGames];
    
    combinedGames.sort((a, b) => {
        const dateA = new Date(`${a.data.split('/').reverse().join('-')}T${a.hora}`);
        const dateB = new Date(`${b.data.split('/').reverse().join('-')}T${b.hora}`);
        return dateA - dateB;
    });

    return combinedGames;
}

// Variáveis para guardar o estado atual dos filtros
let currentModalidadeFilter = 'todos';
let currentTurmaFilter = 'todas';

/**
 * Aplica os filtros atuais (modalidade e turma) e exibe os jogos.
 */
function applyFiltersAndDisplay() {
    let filteredGames = allGames;

    // 1. Aplica o filtro de modalidade (se não for "todos")
    if (currentModalidadeFilter !== 'todos') {
        filteredGames = filteredGames.filter(game => game.modalidade === currentModalidadeFilter);
    }

    // 2. Aplica o filtro de turma (se não for "todas")
    if (currentTurmaFilter !== 'todas') {
        filteredGames = filteredGames.filter(game => {
            // Não filtra eventos de atletismo por time
            if (game.modalidade === 'atletismo') {
                return true; 
            }
            // Verifica se o ID da turma selecionada está em time_a ou time_b
            return game.time_a_details.id === currentTurmaFilter || game.time_b_details.id === currentTurmaFilter;
        });
    }

    displayGames(filteredGames);
}

/**
 * Popula o select de filtro de turmas com os dados da planilha 'times'.
 */
function populateTurmaFilter() {
    const select = document.getElementById('turma-filter-select');
    if (!select) return;

    // Filtra para não incluir placeholders como "Perdedor Jogo X" no select
    const actualTeams = allTeams.filter(team => 
        !team.nome.toLowerCase().includes('jogo') && 
        !team.nome.toLowerCase().includes('melhor de')
    );

    actualTeams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.nome;
        select.appendChild(option);
    });
}

/**
 * Função principal que inicializa a aplicação.
 */
async function main() {
    const rawData = await fetchGamesData();
    allGames = processData(rawData);
    
    populateTurmaFilter(); // Preenche o novo filtro de turmas
    applyFiltersAndDisplay(); // Exibe os jogos com os filtros iniciais
    updateLastUpdated();
    
    const tabButtons = document.querySelectorAll('#modalidades-tab .nav-link');
    const selectFilter = document.getElementById('modalidades-select');
    const turmaFilter = document.getElementById('turma-filter-select');

    // Event listener para os botões de modalidade (desktop)
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentModalidadeFilter = button.getAttribute('data-modalidade');
            selectFilter.value = currentModalidadeFilter;
            applyFiltersAndDisplay();
        });
    });

    // Event listener para o select de modalidade (mobile)
    selectFilter.addEventListener('change', () => {
        currentModalidadeFilter = selectFilter.value;
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-modalidade') === currentModalidadeFilter);
        });
        applyFiltersAndDisplay();
    });

    // Event listener para o NOVO filtro de turmas
    turmaFilter.addEventListener('change', () => {
        currentTurmaFilter = turmaFilter.value;
        applyFiltersAndDisplay();
    });
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', main);