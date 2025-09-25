// src/Pages/CalendarTasks/CalendarTasks.tsx
import React, { useState, useEffect, useRef } from "react";
import { Task } from "../../types";
import {
  fetchTasks,
  addTask,
  toggleTask,
  deleteTask,
} from "../../Services/taskServices";
import { useAuth } from "../../Contexts/AuthContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { parse, format } from "date-fns";
import styles from "./Tasks.module.css";
import { FaTrash } from "react-icons/fa";

const Tasks: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [error, setError] = useState<string | null>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Load tasks
  useEffect(() => {
    if (!token) return;
    fetchTasks(token)
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"));
  }, [token]);

  // Shadow on scroll
  useEffect(() => {
    const el = taskListRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        taskListRef.current &&
        !calendarRef.current.contains(e.target as Node) &&
        !taskListRef.current.contains(e.target as Node)
      ) {
        setSelectedDate(undefined);
        setNewDueDate(""); // reset add-task date input
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helpers
  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  const tasksForDate = (date: Date) =>
    tasks.filter(
      (task) =>
        task.dueDate &&
        parseLocalDate(task.dueDate).toDateString() === date.toDateString()
    );

  const hasTasks = (date: Date) =>
    tasks.some(
      (task) =>
        task.dueDate &&
        parseLocalDate(task.dueDate).toDateString() === date.toDateString()
    );

  // Add new task
  const handleAddTask = async () => {
    if (!newTask || !token) return;

    const tempTask: Task = {
      _id: `temp-${Date.now()}`,
      title: newTask,
      completed: false,
      dueDate: newDueDate || undefined,
    };

    setTasks((prev) => [...prev, tempTask]);
    setNewTask("");
    setNewDueDate("");

    try {
      const savedTask = await addTask(tempTask.title, token, tempTask.dueDate);
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

    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      await toggleTask(id, token);
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
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
    <div className={styles.wrapper}>
      {/* Calendar Section */}
      <div ref={calendarRef} className={styles.calendarSection}>
        <h1>📅 Task Calendar</h1>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (
              date &&
              selectedDate &&
              date.toDateString() === selectedDate.toDateString()
            ) {
              setSelectedDate(undefined); // toggle off if same day clicked
              setNewDueDate(""); // reset add-task date input
            } else if (date) {
              setSelectedDate(date);
              setNewDueDate(format(date, "yyyy-MM-dd")); // prefill add-task input
            }
          }}
          modifiers={{ dayWithTask: hasTasks }}
          modifiersClassNames={{ dayWithTask: styles.dayWithTask }}
        />
      </div>

      {/* Task Section */}
      <div
        className={`${styles.taskSection} ${scrolled ? styles.scrolled : ""}`}
        ref={taskListRef}
      >
        <h2>
          {selectedDate
            ? `Tasks on ${format(selectedDate, "PPP")}`
            : "My Tasks"}
        </h2>

        {/* Add Task (Top Form) */}
        <div className={styles.addTaskForm}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>

        {/* Show All Tasks button */}
        {selectedDate && (
          <button
            className={styles.clearDateBtn}
            onClick={() => setSelectedDate(undefined)}
          >
            Show All Tasks
          </button>
        )}

        <ul className={styles.taskList}>
          {(selectedDate ? tasksForDate(selectedDate) : tasks).map((task) => {
            const localDate = task.dueDate
              ? (() => {
                  const [y, m, d] = task.dueDate.split("-").map(Number);
                  return new Date(y, m - 1, d);
                })()
              : null;

            return (
              <li key={task._id} className={styles.taskItem}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task._id)}
                />
                <div className={styles.taskContent}>
                  <span
                    className={`${styles.taskTitle} ${
                      task.completed ? styles.completed : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  {localDate && (
                    <span className={styles.taskDueDate}>
                      Due: {localDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteTask(task._id)}
                >
                  <FaTrash />
                </button>
              </li>
            );
          })}
        </ul>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Tasks;
