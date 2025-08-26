import React from 'react';
// CORREÇÃO: O caminho foi ajustado para funcionar de dentro da pasta 'components'
import TaskCard from './TaskCard';

// Array de cores para os cards
const cardColors = ['yellow', 'blue', 'pink', 'orange', 'green', 'purple', 'dodgerblue', 'mediumaquamarine', 'palegreen', 'burlywood'];

// Este componente recebe a lista de tarefas e a renderiza
function TaskList({ tasks }) {
  return (
    <main className="main-content">
      <h1>TODO-List</h1>
      <div className="task-grid">
        {tasks.map((task, index) => {
          const colorClass = cardColors[index % cardColors.length];
          return <TaskCard key={task.id} task={task} colorClass={colorClass} />;
        })}
      </div>
    </main>
  );
}

export default TaskList;
