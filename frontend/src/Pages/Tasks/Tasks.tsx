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
import { FaTrash, FaFilter } from "react-icons/fa";

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
  const [newPriority, setNewPriority] = useState<
    "High" | "Medium" | "Low" | ""
  >("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [showOptional, setShowOptional] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

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
        setNewDueDate("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helpers
  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
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
      priority: newPriority || undefined,
      category: newCategory || undefined,
    };

    setTasks((prev) => [...prev, tempTask]);
    setNewTask("");
    setNewDueDate("");
    setNewPriority("");
    setNewCategory("");

    try {
      const savedTask = await addTask(
        tempTask.title,
        token,
        tempTask.dueDate,
        tempTask.priority,
        tempTask.category
      );
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

  const filteredTasks = (
    selectedDate ? tasksForDate(selectedDate) : tasks
  ).filter(
    (task) =>
      (filterPriority === "" || task.priority === filterPriority) &&
      (filterCategory === "" || task.category === filterCategory)
  );

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
              setSelectedDate(undefined);
              setNewDueDate("");
            } else if (date) {
              setSelectedDate(date);
              setNewDueDate(format(date, "yyyy-MM-dd"));
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
        <div className={styles.taskHeader}>
          <h2>
            {selectedDate
              ? `Tasks on ${format(selectedDate, "PPP")}`
              : "My Tasks"}
          </h2>
          {/* Filter Icon */}
          <FaFilter
            className={styles.filterIcon}
            onClick={() => setShowFilters(!showFilters)}
          />
        </div>

        {/* Add Task Form */}
        <div className={styles.addTaskForm}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />

          {/* Optional Fields Toggle */}
          <div className={styles.optionalToggle}>
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className={styles.optionalBtn}
            >
              {showOptional
                ? "Hide optional fields ▲"
                : "Show optional fields ▼"}
            </button>
          </div>

          {/* Optional Inputs */}
          <div
            className={`${styles.optionalInputs} ${
              showOptional ? styles.show : styles.hide
            }`}
          >
            <div className={styles.inputGroup}>
              <label>Due Date (optional)</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Priority (optional)</label>
              <select
                value={newPriority}
                onChange={(e) =>
                  setNewPriority(e.target.value as "High" | "Medium" | "Low")
                }
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Category (optional)</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
              </select>
            </div>
          </div>

          <button className={styles.addBtn} onClick={handleAddTask}>
            Add
          </button>
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

        {/* Filter Panel */}
        <div
          className={`${styles.filterPanel} ${
            showFilters ? styles.show : styles.hide
          }`}
        >
          <div className={styles.inputGroup}>
            <label>Priority Filter</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Category Filter</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <ul className={styles.taskList}>
          {filteredTasks.map((task) => {
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

                  <div className={styles.badges}>
                    {task.priority && (
                      <span
                        className={`${styles.badge} ${
                          styles[task.priority.toLowerCase()]
                        }`}
                      >
                        {task.priority}
                      </span>
                    )}
                    {task.category && (
                      <span className={styles.badge}>{task.category}</span>
                    )}
                  </div>
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
