// src/Services/taskServices.ts
import axios from "axios";
import { Task } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Helper to get headers with token
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

// Fetch all tasks for the logged-in user
export const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/tasks`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

// Add a new task
export const addTask = async (
  title: string,
  token: string,
  dueDate?: string,
  priority?: "High" | "Medium" | "Low",
  category?: string
): Promise<Task> => {
  const response = await axios.post(
    `${API_URL}/tasks`,
    { title, dueDate, priority, category }, // send them in body
    { headers: getAuthHeaders(token) }
  );
  return response.data;
};

// Toggle task completed
export const toggleTask = async (id: string, token: string): Promise<Task> => {
  const response = await axios.patch(
    `${API_URL}/tasks/${id}/toggle`,
    {}, // empty body
    { headers: getAuthHeaders(token) }
  );
  return response.data;
};

// Delete a task
export const deleteTask = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};
