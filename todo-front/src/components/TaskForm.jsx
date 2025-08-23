import { useState } from "react";
import * as validations from "/Users/Matheus/Desktop/code/Tasky/todo-front/src/utils/validations";

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

//Aqui seta todos valores do inputs
function TaskForm() {
  const [tarefa, setTarefa] = useState({
    titulo: '',
    descricao: '',
    dataFinal: ''
  });

  //Criada uma lista de tarefas temporaria
  //Toda essa logica vai ser alterada com a entrada do BD
  const [listaDeTarefas, setListaDeTarefas] = useState([]);

  //A função handleChange lida com as mudanças feitas nos inputs
  const handleChange = (event) => {
    const {name, value} = event.target;
    setTarefa({...tarefa, [name]: value});
  };

  //Ja a handleSubmit lida com o click no botao para enviar
  const handleSubmit = (event) => {
    event.preventDefault();

    //Aqui e criada a constante com todas as validações
    const titleError = validations.validateTitle(tarefa.titulo);
    const dateError = validations.validateDate(tarefa.dataFinal);
    const duplicatesError = validations.validateDuplicate(listaDeTarefas, tarefa.titulo);

    //E se alguma validação retornar erro ele é verificado agora
    if (titleError) {
      console.log(titleError);
      return;
    }
    
    if (dateError){
      console.log(dateError);
      return;
    }

    if (duplicatesError) {
    console.log(duplicatesError);
    return;
    }

    console.log("O titulo atual é: " + tarefa.titulo);
    console.log("A descrição foi criada");
    console.log("A data de finalização é: " + tarefa.dataFinal);

    //O fetch faz a ligação com a API e cria a tarefa no servidor
    fetch("http://localhost:3000/tarefas/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefa),
    })
      .then((response) => response.json())
      .then((data) => {
        setListaDeTarefas([...listaDeTarefas, data]);
        setTarefa({ titulo: '', descricao: '', dataFinal: '' });
        console.log("Titulo aadicionado a lista e valor retornado para vazio")
      })
      .catch((error) => {
        console.error("Ocorreu um erro na requisição:", error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="titulo"
          value={tarefa.titulo}
          onChange={handleChange}
          type="text"
          autoComplete="off"
          placeholder="Nome da tarefa"
          required
        />

        <textarea
          name="descricao"
          value={tarefa.descricao}
          onChange={handleChange}
          autoComplete="off"
          placeholder="Descrição da tarefa"
        />

        <input 
          type="date"
          name="dataFinal"
          value={tarefa.dataFinal}
          onChange={handleChange} 
        />

        <button name="button" formMethod="post" type="submit">
          Criar tarefa
        </button>
      </form>
    </>
  );
}

export default TaskForm;