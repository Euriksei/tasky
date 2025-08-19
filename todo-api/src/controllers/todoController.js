//aqui eu crio a lista que salva todas as tarefas
const ToDo = [];

//criando uma rota para adicionar tarefas
const criarTarefa = (req, res) => {
    const {titulo, info, dataFinal} = req.body; //Pegar titulo da tarefa no body
    const dataCriacao = new Date()

    //Impedir que o titulo seja vazio
    if(!titulo){
        return res.status(400).json({erro: 'O título é obrigatório'});
    }

    if(dataFinal > dataCriacao){
        return res.status(400).jason({erro: 'Erro na marcação de datas'});
    }

    // Impedir títulos duplicados
    const tituloJaExiste = ToDo.find(t => t.titulo.toLowerCase() === titulo.toLowerCase())
    if (tituloJaExiste) {
        return res.status(400).json({ erro: 'Já existe uma tarefa com esse título' })
    }

    var ID = Math.floor(Math.random()*1001)
    while(ToDo.find(i => i.id === ID)){
        ID = Math.floor(Math.random()*1001)
    }

    //Aqui cria a tarefa com o titulo
    const novaTarefa = {
        id: "#"+ID,
        titulo: titulo,
        descricao: info,
        entrega: dataFinal,
        concluido: false
    }

    //Leva a nova tarefa para dentro da lista
    ToDo.push(novaTarefa)
    console.log('Tarefa criada com sucesso')
    return res.status(201).json(novaTarefa)
};


//Criando uma rota para listar as tarefas
const listarTarefa = (req, res) => {
    res.json(ToDo)
};

//Criando a rota para alterar
const editarTarefa = (req, res) => {
    const id = '#'+ req.params.id;
    const {titulo, concluido} = req.body;
    const tarefa = ToDo.find(t => t.id === id);
        
    if(!tarefa){
        return res.status(404).json({error:'Item não encontrado'});
    }

    if(titulo){
        tarefa.titulo = titulo;
    }

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