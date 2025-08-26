import React from 'react';

// Este componente recebe os dados de uma única tarefa e a classe de cor
function TaskCard({ task, colorClass }) {
  // Formata a data para DD/MM/AAAA
  const formattedDate = task.entrega 
    ? new Date(task.entrega).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
    : 'Sem data';

  return (
    <div className={`task-card ${colorClass}`}>
      <h3>{task.titulo}</h3>
      <p>{task.descricao || 'Sem descrição.'}</p>
      <span className="task-date">Entrega: {formattedDate}</span>
    </div>
  );
}

export default TaskCard;
