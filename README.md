# Tasky: Aplicação de Gerenciamento de Tarefas

Uma aplicação web simples para gerenciamento de tarefas, desenvolvida para demonstrar a criação de uma API RESTful com Node.js e Express, consumida por uma interface de usuário construída com React.

## Funcionalidades Principais

* **Criação de Tarefas:** Adicione novas tarefas com título, descrição e data de finalização.
* **Validações de Formulário:** Garante que o usuário insira dados válidos e evita duplicação de títulos.
* **Listagem de Tarefas:** Exibe todas as tarefas adicionadas.
* **API RESTful:** Comunicação completa entre o frontend e o backend para manipular os dados das tarefas.

## Tecnologias Utilizadas

**Frontend (Client-side)**
* **React:** Biblioteca JavaScript para a interface de usuário.
* **HTML, CSS, JavaScript:** Fundamentos da web.

**Backend (Server-side)**
* **Node.js:** Ambiente de execução JavaScript.
* **Express:** Framework para criação da API.
* **CORS:** Middleware para permitir requisições de diferentes origens.

## Como Executar o Projeto Localmente

Siga os passos abaixo para ter a aplicação rodando na sua máquina.

### Pré-requisitos
* Node.js (versão 14.x ou superior)
* npm (gerenciador de pacotes do Node)

### 1. Configurar o Backend (API)

1.  Navegue até o diretório do seu backend (`todo-back` ou similar).
2.  Instale as dependências:
    ```bash
    npm install express cors
    ```
3.  Inicie o servidor:
    ```bash
    node server.js
    ```
    (Se você tiver o `nodemon` instalado, use `nodemon server.js` para reiniciar o servidor automaticamente a cada mudança).

### 2. Configurar o Frontend (Interface)

1.  Abra um novo terminal e navegue até o diretório do seu frontend (`todo-front`).
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação React:
    ```bash
    npm start
    ```

A aplicação abrirá automaticamente no seu navegador em `http://localhost:3000`.

## Estrutura da API (Backend)

A aplicação se comunica com os seguintes endpoints da API:

* **`POST /tarefas/criar`**
    * **Descrição:** Cria uma nova tarefa.
    * **Corpo da Requisição (JSON):**
        ```json
        {
          "titulo": "Título da tarefa",
          "descricao": "Descrição da tarefa",
          "dataFinal": "YYYY-MM-DD"
        }
        ```
* **`GET /tarefas/listar`**
    * **Descrição:** Retorna a lista completa de todas as tarefas.

* **`PUT /tarefas/editar/:id`**
    * **Descrição:** Atualiza os dados de uma tarefa existente.
    * **Parâmetros da URL:** `:id` (o ID da tarefa a ser editada).
    * **Corpo da Requisição (JSON):**
        ```json
        {
          "titulo": "Novo título (opcional)",
          "descricao": "Nova descrição (opcional)",
          "concluido": true (opcional)
        }
        ```
* **`DELETE /tarefas/deletar/:titulo`**
    * **Descrição:** Deleta uma tarefa pelo seu título.
    * **Parâmetros da URL:** `:titulo` (o título da tarefa a ser deletada).

## Autor

* **Matheus Euriques** -