import React from 'react';

// Este componente recebe o estado da tarefa e as funções para manipulá-lo
function Sidebar({ tarefa, handleChange, handleSubmit }) {
  return (
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
        />

        <button type="submit">Criar Tarefa</button>
      </form>
    </aside>
  );
}

export default Sidebar;
