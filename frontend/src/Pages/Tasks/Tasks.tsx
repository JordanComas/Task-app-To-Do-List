import React, { useState, useEffect } from "react";
import { Task } from "../../types";
import {
  fetchTasks,
  addTask,
  toggleTask,
  deleteTask,
} from "../../Services/taskServices";
import styles from "./Tasks.module.css";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load tasks when component mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      }
    };
    loadTasks();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    if (!newTask) return;
    try {
      const task = await addTask(newTask);
      setTasks([...tasks, task]);
      setNewTask("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add task");
    }
  };

  // Toggle task completed
  const handleToggleTask = async (id: string) => {
    try {
      const updated = await toggleTask(id);
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h1>Tasks Page</h1>

      {error && <p className="error">{error}</p>}

      <div className="new-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task._id)}
            />
            <span className={task.completed ? "completed" : ""}>
              {task.title}
            </span>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
    </div>
  );
};

export default Tasks;
