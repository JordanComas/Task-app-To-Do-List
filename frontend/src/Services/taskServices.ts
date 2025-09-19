import axios from "axios";
import { Task } from "../types";

const API_URL = "http://localhost:4000/tasks";

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await axios.get<Task[]>(API_URL);
  return res.data;
};

export const addTask = async (title: string): Promise<Task> => {
  const res = await axios.post<Task>(API_URL, { title });
  return res.data;
};

export const toggleTask = async (id: string): Promise<Task> => {
  const res = await axios.put<Task>(`${API_URL}/${id}`);
  return res.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
