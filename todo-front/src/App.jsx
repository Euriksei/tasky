import { useState, useEffect } from "react";
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import './App.css';

function App() {
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
  }, []);

  // Função para buscar as tarefas na API
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/tarefas/listar');
      if (!response.ok) {
        throw new Error('Erro ao buscar tarefas');
      }
      const tasks = await response.json();
      setListaDeTarefas(tasks);
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
    if (!tarefa.titulo) {
      alert('Por favor, preencha o título.');
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
      
      setTarefa({ titulo: '', descricao: '', dataFinal: '' });
      fetchTasks();

    } catch (error) {
      console.error("Ocorreu um erro na requisição:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        tarefa={tarefa}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <TaskList tasks={listaDeTarefas} />
    </div>
  );
}

export default App;
