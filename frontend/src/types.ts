export interface Task {
  _id: string; // MongoDB ID
  title: string;
  completed: boolean;
  dueDate?: string; // ISO date string
}
