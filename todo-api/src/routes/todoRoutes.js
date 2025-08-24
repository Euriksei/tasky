const express = require('express');
const router = express.Router();

//Importando as rotas do controller
const todoController = require('../controllers/todoController');

//Cada rota chama a função correspondente
router.post('/criar', todoController.criarTarefa);
router.get('/listar', todoController.listarTarefa);
router.put('/editar/:id', todoController.editarTarefa);
router.delete('/deletar/:titulo', todoController.deletarTarefa);

module.exports = router;