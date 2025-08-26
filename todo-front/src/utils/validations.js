// Criado um programa à parte para lidar com os erros e deixar o código mais limpo.
// Aqui segue toda a lógica de validações.

/**
 * Função para verificar se o título é vazio.
 * @param {string} title - O título da tarefa.
 * @returns {string|null} - Retorna uma mensagem de erro ou null se for válido.
 */
export const validateTitle = (title) => {
    if (!title || title.trim() === '') {
        return "O título não pode ser vazio.";
    }
    return null;
};

/**
 * Função para verificar se a data de finalização não é no passado.
 * @param {string} date - A data no formato "AAAA-MM-DD".
 * @returns {string|null} - Retorna uma mensagem de erro ou null se for válido.
 */
export const validateDate = (date) => {
    // Se a data não for fornecida, a validação passa (tarefa sem data de entrega é permitida).
    if (!date) {
        return null;
    }

    // Pega a data de hoje e remove as horas, minutos, segundos e milissegundos.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // O input type="date" envia a data como uma string "AAAA-MM-DD".
    // new Date() pode interpretar isso como UTC, causando problemas de fuso horário.
    // Para corrigir, criamos a data e ajustamos para o fuso horário local.
    const futureDate = new Date(date);
    const userTimezoneOffset = futureDate.getTimezoneOffset() * 60000;
    const adjustedFutureDate = new Date(futureDate.getTime() + userTimezoneOffset);
    adjustedFutureDate.setHours(0, 0, 0, 0);

    // A lógica de validação foi ajustada para incluir o dia de hoje como válido.
    // O erro acontece apenas se a data de finalização for anterior ao dia de hoje.
    if (adjustedFutureDate < today) {
        return "A data de finalização não pode ser no passado.";
    }
    return null;
};

/**
 * Função para verificar se já existe uma tarefa com o mesmo título (ignorando maiúsculas/minúsculas).
 * @param {Array} list - A lista de tarefas existentes.
 * @param {string} newTitle - O novo título a ser verificado.
 * @returns {string|null} - Retorna uma mensagem de erro ou null se não houver duplicados.
 */
export const validateDuplicate = (list, newTitle) => {
    if (list.some(item => item.titulo.toLowerCase() === newTitle.toLowerCase())) {
        return "Já existe uma tarefa com esse nome";
    }
    return null;
}
