//aqui eu crio a lista que salva todas as tarefas
const ToDo = [];

//criando uma rota para adicionar tarefas
const criarTarefa = (req, res) => {
    const {titulo, descricao, dataFinal} = req.body; //Pegar titulo da tarefa no body da requisição
    const dataCriacao = new Date().setHours(0,0,0,0);//a data de criação é pegada automaticamente e setado seus valores de hora para 00:00

    //Vilidações
    //Impedir que o titulo seja vazio
    if(!titulo){
        return res.status(400).json({erro: 'O título é obrigatório'});
    }

    //Impedir que a data final seja no passado (ainda requer correçoes)
    if(new Date(dataFinal).setHours(0,0,0,0) < dataCriacao){
        return res.status(400).json({erro: 'Erro na marcação de datas'});
    }

    // Impedir títulos duplicados
    const tituloJaExiste = ToDo.find(t => t.titulo.toLowerCase() === titulo.toLowerCase());
    if (tituloJaExiste) {
        return res.status(400).json({ erro: 'Já existe uma tarefa com esse título' });
    }

    //Gerar um valor de ID (numero aleatorio de 1 a 1000 (ainda tera melhorias))
    var ID = Math.floor(Math.random()*1001)
    while(ToDo.find(i => i.id === ID)){
        ID = Math.floor(Math.random()*1001)
    }

    //Aqui cria a tarefa com o titulo
    //A condiçoes de concluido como falso é gerado por padrao, sendo possivel a alteração pelo usuario mais tarde
    const novaTarefa = {
        id: "#"+ID,
        titulo: titulo,
        descricao: descricao,
        entrega: dataFinal,
        concluido: false
    }
    
    //LOGs DE TESTE 
    console.log('Log do objeto completo:', novaTarefa);
    console.log('Log de teste: Funcionou!');
    
    //Leva a nova tarefa para dentro da lista
    ToDo.push(novaTarefa)
    console.log('Tarefa criada com sucesso')
    return res.status(201).json(novaTarefa)
};

    
//Criando uma rota para listar as tarefas
//Simplesmente imprime o arquivo
const listarTarefa = (req, res) => {
    res.json(ToDo);
};

//Criando a rota para alterar
//Para alterar é necessario buscar a tarefa pelo seu numero de ID direto no paremetro URL da requisição
//(tera melhorias)
const editarTarefa = (req, res) => {
    const id = '#'+ req.params.id;
    const {titulo, descricao, dataFinal, concluido} = req.body;

    //Procurando a tarefa pelo ID na LIsta
    //Irei adicionar um melhoria fazendo que seja possivel a busca pelo titulo
    const tarefa = ToDo.find(t => t.id === id);
        
    //Verificação se existe tal tarefa
    if(!tarefa){
        return res.status(404).json({error:'Item não encontrado'});
    }

    //Verificar se o usuario deseja a edição do titulo, se ele deixar o campo em branco, o titulo anterior sera mantido
    if(titulo){
        tarefa.titulo = titulo;
    }

    //A mesma logica a seguir.
    if(descricao){
        tarefa.descricao = descricao;
    }

    if(dataFinal){
        tarefa.dataFinal = dataFinal;
    }

    //A edição do concluido aqui, so funciona por enquanto sem o front, quando for implementado sera necessario um alteração na logica
    if(concluido !== undefined){
        if(typeof concluido !== 'boolean'){
            return res.status(400).json({erro:'O valor deve ser booleano'});
        }
        tarefa.concluido = concluido;
    }
    console.log('Tarefa editada')
    res.json(tarefa)
};

//Rota para deletar
const deletarTarefa = (req, res) => {
    const {titulo} = req.params;

    //A rota para deletar procura pelo titulo
    if(!titulo){
        console.log('Erro ao procurar tarefa para deletar');
        res.status(404).json({error:'Item não encontrado'});
    }

    const tarefa = ToDo.findIndex(t => t.titulo === titulo);
    if(tarefa === -1){
        return res.status(404).json({error:'Item não encontrado'});
    }

    ToDo.splice(tarefa, 1);
    return res.json({message: 'Tarefa excluida com sucesso'})

};

module.exports = {
    criarTarefa,
    listarTarefa,
    editarTarefa,
    deletarTarefa
};