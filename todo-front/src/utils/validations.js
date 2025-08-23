//Criado um programa a parte para lidar com os erros e deixar o codigo mais limpo.
//Aqui segue toda logica de validações
//Função para verificar se o titulo é vazio
export const validateTitle = (title) => {
    if(!title){
        return "O título não pode ser vazio.";
    }
    return null;
};

export const validateDate = (date) => {
    //Pega a data de hoje e remove as horas, minutos, segundos e milissegundos
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //Pega a data de finalização, também removendo as horas
    const futureDate = new Date(date);
    futureDate.setHours(0, 0, 0, 0);

    //A lógica de validação foi ajustada para incluir o dia de hoje como válido.
    // O erro acontece apenas se a data de finalização for anterior ao dia de hoje.
    //Requer verificação
    if(futureDate < today){
        return "A data de finalização não pode ser no passado.";
    }
    return null;
};

export const validateDuplicate = (list, newTitle) => {
    if(list.some(item => item.titulo.toLowerCase() === newTitle.toLowerCase())){
        return "Já existe uma tarefa com esse nome";
    }
    return null;
} 