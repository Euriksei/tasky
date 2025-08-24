//Trocando a lista pelo SQLlite
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database.db', (err) => {
    if(err) {
        console.error(err.message);
    }
    console.log("Conectado ao Banco de Dados");
});

//Comando que cria as tabelas
db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT,
        entrega TEXT,
        concluido INTEGER
    )
`, (err) => { // AQUI é onde o callback de erro começa
    if (err) {
        console.error(err.message);
    } else {
        console.log('Tabela "tarefas" pronta.');
    }
});

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
    //db.get() retorna apenas a primeira linha encontrada
    db.get("SELECT * FROM tarefas WHERE lower(titulo) = ?",[titulo.toLowerCase()], (err, row) =>{
        if(err){
            console.log(err.message);
            return res.status(500).json({erro:'Erro interno do servidor'});
        }
        //Se 'row' não for nulo, significa que um título duplicado foi encontrado
        if(row){
            return res.status(400).json({erro: 'Ja existe uma tarefa com esse nome'});
        }
    })

    //Gerar um valor de ID (numero aleatorio de 1 a 1000 (ainda tera melhorias))
    var ID = Math.floor(Math.random()*1001)
    const idString = "#" + ID;
    
    const novaTarefa = {
        id: idString,
        titulo: titulo,
        descricao: descricao,
        entrega: dataFinal,
        concluido: 0
    }
    
    //Executa o comando para criar
    //Aqui começa a utilização do BD
    const sql = `INSERT INTO tarefas (id, titulo, descricao, entrega, concluido) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [novaTarefa.id, novaTarefa.titulo, novaTarefa.descricao, novaTarefa.entrega, novaTarefa.concluido],
        function (err){
            if(err){
                console.log(err.message)
                return res.status(400).json({erro: 'Já existe uma tarefa com esse nome'});
            }

            console.log(`Tarefa com id ${novaTarefa.id} foi criada com sucesso.`);
            // Enviamos a nova tarefa de volta para o frontend.
            return res.status(201).json(novaTarefa);
        }
    );
};

    
//Criando uma rota para listar as tarefas
//Simplesmente imprime o arquivo
const listarTarefa = (req, res) => {
    const sql = "SELECT * FROM tarefas";
    db.all(sql, [], (err, rows) => {
        if(err){
            console.log(err.message)
            return res.status(500).json({erro: 'Erro ao listar'});
        }
        res.json(rows);
    });
};

//Criando a rota para alterar
//Para alterar é necessario buscar a tarefa pelo seu numero de ID direto no paremetro URL da requisição
//(tera melhorias)
//Criando a rota para alterar
const editarTarefa = (req, res) => {
    //Pega o ID da URL e os dados do corpo da requisição
    const id = '#'+ req.params.id;
    const {titulo, descricao, dataFinal, concluido} = req.body;
    console.log("Valor de dataFinal recebido:", dataFinal);
    // Verificamos se o ID foi fornecido
    if (!id) {
        return res.status(400).json({ error: "O ID da tarefa é obrigatório." });
    }

    //Preparamos a consulta e os parâmetros de forma dinâmica
    const updates = [];
    const params = [];

    if (titulo) {
        updates.push("titulo = ?");
        params.push(titulo);
    }
    if (descricao) {
        updates.push("descricao = ?");
        params.push(descricao);
    }
    // Lembre-se, o campo no BD é 'entrega', não 'dataFinal'
    if (dataFinal) {
        updates.push("entrega = ?");
        params.push(dataFinal);
    }
    // No SQLite, 0 é false e 1 é true
    if (concluido !== undefined) {
        updates.push("concluido = ?");
        params.push(concluido ? 1 : 0);
    }
    
    // Se não houver nada para atualizar, retorne um erro
    if (updates.length === 0) {
        return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido." });
    }
    
    // Adiciona o ID ao final dos parâmetros para a cláusula WHERE
    params.push(id);
    
    //Monta a consulta SQL de forma dinâmica
    const sql = `UPDATE tarefas SET ${updates.join(", ")} WHERE id = ?`;

    // Executa a atualização
    // db.run() também é usado para UPDATES, e a função 'this.changes' retorna o número de linhas afetadas.
    db.run(sql, params, function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Erro ao atualizar a tarefa." });
        }
        // Se a atualização foi bem-sucedida (e afetou 1 linha)
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item não encontrado ou ID incorreto.' });
        }

        console.log(`Tarefa com ID ${id} foi editada com sucesso. Linhas afetadas: ${this.changes}`);
        // Retorna uma resposta de sucesso sem precisar buscar o item novamente.
        res.json({ message: 'Tarefa atualizada com sucesso.' });
    });
};

//Rota para deletar
const deletarTarefa = (req, res) => {
    // Vamos usar o ID para deletar, pois é mais confiável que o título
    const id = '#'+ req.params.id;
    console.log("ID da requisição:", req.params.id);
    console.log("ID a ser deletado:", id);
    
    // A validação de entrada é feita aqui no início
    if(!id){
        console.log('Erro ao procurar tarefa para deletar');
        return res.status(404).json({error:'ID da tarefa não fornecido'});
    }

    const sql = `DELETE FROM tarefas WHERE id = ?`;

    // A chamada ao banco de dados é feita apenas uma vez
    db.run(sql, [id], function(err) {
        if(err) {
            console.error(err.message);
            return res.status(500).json({ error: "Erro ao deletar a tarefa"});
        }

        // Verificamos o número de linhas afetadas (deletadas)
        if (this.changes === 0) {
            // Se nenhuma linha foi deletada, o item não foi encontrado
            return res.status(404).json({ error: 'Item não encontrado ou ID incorreto.' });
        }

        // Se o número de mudanças for maior que 0, a deleção foi um sucesso
        console.log(`Tarefa com ID ${id} foi deletada com sucesso. Linhas afetadas: ${this.changes}`);
        return res.json({message: 'Tarefa deletada com sucesso'});
    });
};

module.exports = {
    criarTarefa,
    listarTarefa,
    editarTarefa,
    deletarTarefa
};