import React, { useState, useEffect, useRef } from "react";
import { Task } from "../../types";
import {
  fetchTasks,
  addTask,
  toggleTask,
  deleteTask,
} from "../../Services/taskServices";
import { FaTrash } from "react-icons/fa";
import styles from "./Tasks.module.css";
import { useAuth } from "../../Contexts/AuthContext";

const Tasks: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load tasks once token is available
  useEffect(() => {
    if (!token) return;

    const loadTasks = async () => {
      try {
        const data = await fetchTasks(token);

        // Sort: completed tasks first
        const sorted = data.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? -1 : 1;
        });

        setTasks(sorted);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      }
    };

    loadTasks();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showNewInput &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowNewInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNewInput]);

  // Add a new task
  const handleAddTask = async () => {
    if (!newTask || !token) return;
    const tempTask: Task = {
      _id: `temp-${Date.now()}`,
      title: newTask,
      completed: false,
    };
    setTasks((prev) => [...prev, tempTask]);
    setNewTask("");
    setShowNewInput(false);

    try {
      const savedTask = await addTask(tempTask.title, token);
      setTasks((prev) =>
        prev.map((t) => (t._id === tempTask._id ? savedTask : t))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to add task");
      setTasks((prev) => prev.filter((t) => t._id !== tempTask._id));
    }
  };

  const handleToggleTask = async (id: string) => {
    if (!token) return;

    // Optimistically update and reorder tasks
    setTasks((prev) => {
      return prev
        .map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
        .sort((a, b) => {
          // completed tasks go first
          if (a.completed === b.completed) return 0;
          return a.completed ? -1 : 1;
        });
    });

    try {
      await toggleTask(id, token);
    } catch (err) {
      console.error(err);
      setError("Failed to update task");

      // Revert toggle and reorder if backend fails
      setTasks((prev) => {
        return prev
          .map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
          .sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? -1 : 1;
          });
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!token) return;

    const removedTask = tasks.find((t) => t._id === id);
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      await deleteTask(id, token);
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
      if (removedTask) setTasks((prev) => [...prev, removedTask]);
    }
  };

  return (
    <div className={styles.taskContainer}>
      <h1 className={styles.title}>My Tasks</h1>
      <div className={styles.taskListWrapper} ref={containerRef}>
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`${styles.taskItem} ${
                task.completed ? styles.completed : ""
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task._id)}
              />
              <span>{task.title}</span>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDeleteTask(task._id)}
              >
                <FaTrash />
              </button>
            </li>
          ))}

          {showNewInput && (
            <div className={styles.newTaskContainer}>
              <li className={styles.newTaskItem}>
                <input
                  ref={inputRef}
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="New task..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTask();
                  }}
                />
                <button onClick={handleAddTask}>Add</button>
              </li>
            </div>
          )}
        </ul>

        {!showNewInput && (
          <button
            className={styles.addTaskBtn}
            onClick={() => {
              setShowNewInput(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          >
            +
          </button>
        )}
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Tasks;
