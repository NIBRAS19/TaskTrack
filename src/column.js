import React, { useState } from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';

function Column({ column, tasks, addTask }) {
  const [taskContent, setTaskContent] = useState('');

  const handleAddTask = () => {
    if (taskContent.trim()) {
      addTask(column.id, taskContent);
      setTaskContent('');
    }
  };

  return (
    <div style={{ margin: 8, border: '1px solid lightgrey', borderRadius: 4, width: 300 }}>
      <h3 style={{ padding: 8 }}>{column.title}</h3>
      <input
        type="text"
        placeholder="Add a task..."
        value={taskContent}
        onChange={(e) => setTaskContent(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        style={{ padding: 8, width: '90%', marginBottom: 8 }}
      />
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ padding: 8, minHeight: 100, backgroundColor: '#f8f8f8' }}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;

