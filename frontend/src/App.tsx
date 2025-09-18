import React, { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "./types";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:4000/tasks";

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>(API_URL);
      setTasks(res.data);
    } catch (err: any) {
      setError(err.message || "Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    try {
      if (!newTask) return;
      const res = await axios.post<Task>(API_URL, { title: newTask });
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (err: any) {
      setError(err.message || "Error adding task");
    }
  };

  // Toggle complete
  const toggleTask = async (_id: string) => {
    try {
      const res = await axios.put<Task>(`${API_URL}/${_id}`);
      setTasks(tasks.map((t) => (t._id === _id ? res.data : t)));
    } catch (err: any) {
      setError(err.message || "Error toggling task");
    }
  };

  // Delete task
  const deleteTask = async (_id: string) => {
    try {
      await axios.delete(`${API_URL}/${_id}`);
      setTasks(tasks.filter((t) => t._id !== _id));
    } catch (err: any) {
      setError(err.message || "Error deleting task");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Task Tracker</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginTop: "0.5rem" }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task._id)}
            />
            <span
              style={{ textDecoration: task.completed ? "line-through" : "" }}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task._id)}
              style={{ marginLeft: "1rem" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
