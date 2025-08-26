import { useState, useEffect } from "react";
import './TaskForm.css'; // Importa os estilos que você acabou de criar

// Array de cores para os cards
const cardColors = ['yellow', 'blue', 'pink', 'orange', 'dodgerblue', 'mediumacquamarine', 'palegreen', 'burlywood' ];

function TaskForm() {
  // State para os campos do formulário
  const [tarefa, setTarefa] = useState({
    titulo: '',
    descricao: '',
    dataFinal: ''
  });

  // State para armazenar a lista de tarefas vinda da API
  const [listaDeTarefas, setListaDeTarefas] = useState([]);

  // useEffect para buscar as tarefas da API assim que o componente carregar
  useEffect(() => {
    fetchTasks();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // Função para buscar as tarefas na API
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/tarefas/listar');
      if (!response.ok) {
        throw new Error('Erro ao buscar tarefas');
      }
      const tasks = await response.json();
      setListaDeTarefas(tasks); // Atualiza o state com as tarefas
    } catch (error) {
      console.error('Falha na requisição:', error);
    }
  };

  // Lida com as mudanças nos inputs do formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setTarefa({ ...tarefa, [name]: value });
  };

  // Lida com o envio do formulário para criar uma nova tarefa
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validação simples
    if (!tarefa.titulo || !tarefa.dataFinal) {
      alert('Por favor, preencha o título e a data final.');
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/tarefas/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefa),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao criar a tarefa');
      }
      
      // Limpa o formulário e busca a lista de tarefas atualizada
      setTarefa({ titulo: '', descricao: '', dataFinal: '' });
      fetchTasks();

    } catch (error) {
      console.error("Ocorreu um erro na requisição:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      {/* Menu Lateral com o Formulário */}
      <aside className="sidebar">
        <h2>Adicionar Tarefa</h2>
        <form onSubmit={handleSubmit} className="task-form">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            name="titulo"
            value={tarefa.titulo}
            onChange={handleChange}
            type="text"
            placeholder="Ex: Planejar conteúdo"
            required
          />

          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={tarefa.descricao}
            onChange={handleChange}
            placeholder="Ex: Detalhes da tarefa..."
          />

          <label htmlFor="dataFinal">Data Final</label>
          <input
            id="dataFinal"
            type="date"
            name="dataFinal"
            value={tarefa.dataFinal}
            onChange={handleChange}
            required
          />

          <button type="submit">Criar Tarefa</button>
        </form>
      </aside>

      {/* Conteúdo Principal com os Cards */}
      <main className="main-content">
        <h1>Minhas Tarefas</h1>
        <div className="task-grid">
          {listaDeTarefas.map((task, index) => {
            // Formata a data para DD/MM/AAAA
            const formattedDate = task.entrega ? new Date(task.entrega).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Sem data';
            const colorClass = cardColors[index % cardColors.length];
            
            return (
              <div key={task.id} className={`task-card ${colorClass}`}>
                <h3>{task.titulo}</h3>
                <p>{task.descricao || 'Sem descrição.'}</p>
                <span className="task-date">Entrega: {formattedDate}</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default TaskForm;

/*
  O projeto inicia com a criação de um componente de formulário para receber o valor que o usuário
  escrever dentro do input. É criado uma constante useState que serve para salvar uma mudança no código 
  (mais especificamente no input) e enviar para o backend. É criado tambem um useState para criar uma lista
  de tarefas temporaria, que será enviado posteriormente

  Funciona da seguinte forma. O input recebe um valor que é o título. Então o onChange executa uma função (event)
  assim que o usuário interage com o campo, função essa que pega o conteúdo 
  do input e o salva no setTitulo.

  `onChange={(event) => setTitulo(event.target.value)}`

  Logo apos é feita as verificaçoes para impedir que o titulo seja vazio ou repetido, verificaçoes essas que tambem
  precisam ser feitas no backend.

    `fetch("http://localhost:3000/tarefas/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    })`

    Aqui na função fetch recebe dois arumentos, o URL da API e a lista de instruções, no caso
    method: a função que vai executar (POST)
    headers: tipo de conteudo que ira receber (JSON)
    body: o arquivo em si 
    
    Como no backend eu havia informado que para a função de criar era esperado receber o conteudo no corpo 
    do JSON (body), é exatamente ele quem passamos. Por isso usamos a função JSON.stringfy(), que recebe o conteudo é o transforma
    em um objeto JSON.

    Depois disso usamos o .then para lidar com as repostas que nossa requisição à API retornou.
    O primeiro .then, recebe como paramentro a 'response' da requisição do nosso bakcend, Essa é a resposta bruta da API
    que precisamos converter para JSON. O .then retorna tambem uma promise que é pegada como parametro de 
    forma automatica pelo proximo .then e é nomeado de 'data'.

    Nosso segundo .then é uma função que pega nossa lista temporatia `setListaDeTarefas` e diz 
    que ela recebe ela mesmo mais a nova tarefa (data), em seguida retorna o valor do setTitulo para uma string vazia.

    é criado um catch logo abaixo para lidar com possiveis erros na requisição.

*/