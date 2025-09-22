import axios from "axios";
import { Task } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Helper to get token and return headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Fetch all tasks for the logged-in user
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/api/tasks`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Add a new task
export const addTask = async (title: string): Promise<Task> => {
  const response = await axios.post(
    `${API_URL}/api/tasks`,
    { title },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Toggle task completion
export const toggleTask = async (id: string): Promise<Task> => {
  const response = await axios.patch(
    `${API_URL}/api/tasks/${id}/toggle`,
    null, // No body needed
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Delete a task
export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/api/tasks/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
