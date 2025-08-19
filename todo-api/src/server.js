//Começamos importando o express
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

//Importa todas as rotas
const todoRoutes = require('./routes/todoRoutes');

//Para permitir receber json no body
app.use(express.json());
app.use(cors());
app.use('/tarefas', todoRoutes);

//Faz o servidor rodar na porta atual
app.listen(PORT, () => {
    console.log('Rodando');     
});