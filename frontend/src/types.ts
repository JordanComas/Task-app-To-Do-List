export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: "High" | "Medium" | "Low";
  category?: string; // e.g., "Work", "Personal", "Health"
}
