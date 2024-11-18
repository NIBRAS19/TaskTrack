import React, { useState, useEffect } from "react";
import "./App.css";
import edit from "./assets/editing.png";
import trash from "./assets/trash.png";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("kanbanTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [editMode, setEditMode] = useState({ id: null, content: "" });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, taskId: null });
  const [clearAllConfirm, setClearAllConfirm] = useState(false);
  const [taskInput, setTaskInput] = useState({ content: "", column: null });
  const [showNotification, setShowNotification] = useState(false);

  // Save tasks to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (status) => {
    setTaskInput({ content: "", column: status });
  };

  const saveNewTask = () => {
    if (!taskInput.content.trim()) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      return;
    }

    const id = Date.now().toString();
    const newTask = { id, content: taskInput.content, status: taskInput.column };
    setTasks([...tasks, newTask]);
    setTaskInput({ content: "", column: null });
  };

  const cancelNewTask = () => {
    setTaskInput({ content: "", column: null });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      saveNewTask();
    }
  };

  const startEditing = (id, currentContent) => {
    setEditMode({ id, content: currentContent });
  };

  const saveEdit = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, content: editMode.content } : task
      )
    );
    setEditMode({ id: null, content: "" });
  };

  const handleEditChange = (e) => {
    setEditMode((prev) => ({ ...prev, content: e.target.value }));
  };

  const confirmDeleteTask = (id) => {
    setDeleteConfirm({ show: true, taskId: id });
  };

  const deleteTask = () => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== deleteConfirm.taskId)
    );
    setDeleteConfirm({ show: false, taskId: null });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, taskId: null });
  };

  const confirmClearAll = () => {
    setClearAllConfirm(true);
  };

  const clearAllTasks = () => {
    setTasks([]);
    localStorage.removeItem("kanbanTasks");
    setClearAllConfirm(false);
  };

  const cancelClearAll = () => {
    setClearAllConfirm(false);
  };

  const onDragStart = (event, id) => {
    event.dataTransfer.setData("text/plain", id);
  };

  const onDrop = (event, newStatus) => {
    const id = event.dataTransfer.getData("text/plain");
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const renderTask = (task) => (
    <div
      key={task.id}
      className="task"
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
    >
      {editMode.id === task.id ? (
        <input
          type="text"
          value={editMode.content}
          onChange={handleEditChange}
          onBlur={() => saveEdit(task.id)}
          autoFocus
        />
      ) : (
        <span>{task.content}</span>
      )}
      <div>
        <img
          src={edit}
          alt="Edit"
          onClick={() => startEditing(task.id, task.content)}
        />
        <img
          src={trash}
          alt="Delete"
          onClick={() => confirmDeleteTask(task.id)}
        />
      </div>
    </div>
  );

  return (
    <div className="kanban-container">
      <h1>Kanban Board</h1>
      <button className="clear-all-button" onClick={confirmClearAll}>
        Clear All Tasks
      </button>
      <div className="kanban-board">
        {["todo", "in-progress", "done"].map((status) => (
          <div
            key={status}
            className="kanban-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, status)}
          >
            <h2>
              {status.replace("-", " ").toUpperCase()}{" "}
              <span className="task-count">{getTasksByStatus(status).length}</span>
            </h2>
            <div className="task-list">
              {getTasksByStatus(status).map(renderTask)}
            </div>
            <div className="add-task-container">
              <button onClick={() => handleAddTask(status)}>Add Task</button>
            </div>
          </div>
        ))}
      </div>

      {taskInput.column && (
        <div className="task-input-dialog">
          <h3>Add Task to {taskInput.column.replace("-", " ").toUpperCase()}</h3>
          <input
            type="text"
            value={taskInput.content}
            onChange={(e) => setTaskInput({ ...taskInput, content: e.target.value })}
            onKeyDown={handleKeyPress}
            placeholder="Enter task description"
            autoFocus
          />
          <button onClick={saveNewTask}>Save</button>
          <button onClick={cancelNewTask}>Cancel</button>
        </div>
      )}

      {deleteConfirm.show && (
        <div className="delete-confirm-dialog">
          <p>Are you sure to delete this task?</p>
          <button onClick={deleteTask}>Delete</button>
          <button onClick={cancelDelete}>Cancel</button>
        </div>
      )}

      {clearAllConfirm && (
        <div className="clear-all-dialog">
          <p>Are you sure you want to clear all tasks?</p>
          <button onClick={clearAllTasks}>Clear All</button>
          <button onClick={cancelClearAll}>Cancel</button>
        </div>
      )}

      {showNotification && (
        <div className="notification">
          Task cannot be empty!
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
