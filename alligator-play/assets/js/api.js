/**
 * Converte um texto no formato CSV para um array de objetos.
 * A primeira linha do CSV é usada como as chaves dos objetos.
 * @param {string} csvText O texto do arquivo CSV.
 * @returns {Array<Object>} Um array de objetos representando os dados.
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return []; // Retorna vazio se não tiver cabeçalho e dados

    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        if (values.length === headers.length) {
            const entry = {};
            for (let j = 0; j < headers.length; j++) {
                entry[headers[j]] = values[j];
            }
            data.push(entry);
        }
    }
    return data;
}

/**
 * Busca os dados de todas as planilhas publicadas como CSV.
 * @returns {Promise<Object>} Uma promessa que resolve com os dados dos jogos e times.
 */
export async function fetchGamesData() {
    // IMPORTANTE: Substitua as URLs abaixo pelas URLs dos seus CSVs publicados!
    const urls = {
        times: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQL66VoDmqcIlC6NIoE1oDZwwWPovhV2PHMWt6_DNMTrd02hUE4VK6omhC-B2PN13f0q98roWNbCspH/pub?gid=1510602111&single=true&output=csv',
        futsal: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQL66VoDmqcIlC6NIoE1oDZwwWPovhV2PHMWt6_DNMTrd02hUE4VK6omhC-B2PN13f0q98roWNbCspH/pub?gid=1254567625&single=true&output=csv',
        volei: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQL66VoDmqcIlC6NIoE1oDZwwWPovhV2PHMWt6_DNMTrd02hUE4VK6omhC-B2PN13f0q98roWNbCspH/pub?gid=1426030614&single=true&output=csv',
        queimada: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQL66VoDmqcIlC6NIoE1oDZwwWPovhV2PHMWt6_DNMTrd02hUE4VK6omhC-B2PN13f0q98roWNbCspH/pub?gid=548699490&single=true&output=csv',
        atletismo: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQL66VoDmqcIlC6NIoE1oDZwwWPovhV2PHMWt6_DNMTrd02hUE4VK6omhC-B2PN13f0q98roWNbCspH/pub?gid=1177369269&single=true&output=csv',
        cabo_de_guerra: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQL66VoDmqcIlC6NIoE1oDZwwWPovhV2PHMWt6_DNMTrd02hUE4VK6omhC-B2PN13f0q98roWNbCspH/pub?gid=250621862&single=true&output=csv' 
    };

    try {
        // Faz o fetch de todas as URLs em paralelo
        const responses = await Promise.all(Object.values(urls).map(url => fetch(url)));
        
        // Verifica se todas as requisições foram bem sucedidas
        for (const response of responses) {
            if (!response.ok) {
                throw new Error(`Falha ao carregar dados da planilha: ${response.statusText}`);
            }
        }

        const textData = await Promise.all(responses.map(res => res.text()));

        // Converte o texto CSV de cada um para um array de objetos
        const [times, futsal, volei, queimada, atletismo, cabo_de_guerra] = textData.map(parseCSV);

        return { times, futsal, volei, queimada, atletismo, cabo_de_guerra };

    } catch (error) {
        console.error("Erro ao buscar os dados das planilhas:", error);
        // Retorna um objeto com arrays vazios em caso de erro para a aplicação não quebrar
        return { times: [], futsal: [], volei: [], queimada: [], atletismo: [], cabo_de_guerra: [] };
    }
}