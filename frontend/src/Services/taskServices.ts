import axios from "axios";
import { Task } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Fetch all tasks for the logged-in user
export const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Add a new task
export const addTask = async (title: string, token: string): Promise<Task> => {
  const response = await axios.post(
    `${API_URL}/api/tasks`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Toggle task completion
export const toggleTask = async (id: string, token: string): Promise<Task> => {
  const response = await axios.patch(
    `${API_URL}/api/tasks/${id}/toggle`,
    null,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Delete a task
export const deleteTask = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/api/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
