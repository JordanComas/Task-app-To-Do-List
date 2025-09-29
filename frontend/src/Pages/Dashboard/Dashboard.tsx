import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./Dashboard.module.css";
import { Task } from "../../types";
import {
  fetchTasks,
  toggleTask,
  deleteTask,
} from "../../Services/taskServices";
import { useAuth } from "../../Contexts/AuthContext";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token, user } = useAuth(); // <-- get user

  // Load tasks
  useEffect(() => {
    if (!token) return;

    const loadTasks = async () => {
      try {
        const data = await fetchTasks(token);
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };

    loadTasks();
  }, [token]);

  // Determine greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const greeting = `${getGreeting()}${user?.name ? `, ${user.name}` : ""}`;

  // --- Task stats & upcoming tasks ---
  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const uncompletedCount = total - completedCount;
  const completionPercent = total
    ? Math.round((completedCount / total) * 100)
    : 0;

  const categories = ["Work", "Personal", "Health"] as const;
  const categoryCounts = categories.map(
    (cat) => tasks.filter((t) => t.category === cat).length
  );
  const categoryPercentages = categoryCounts.map((count) =>
    total ? Math.round((count / total) * 100) : 0
  );
  const colors = ["#34312D", "#b2c539ff", "#D9C5B2"];

  const upcomingTasks = tasks
    .filter((t) => t.dueDate)
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
    .slice(0, 5);

  // --- Handlers ---
  const handleToggle = async (taskId: string) => {
    if (!token) return;
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
    try {
      await toggleTask(taskId, token);
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;
    const removedTask = tasks.find((t) => t._id === taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await deleteTask(taskId, token);
    } catch (err) {
      console.error("Failed to delete task:", err);
      if (removedTask) setTasks((prev) => [...prev, removedTask]);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h1>{greeting}</h1> {/* <-- dynamic greeting */}
      <div className={styles.topSection}>
        {/* Quick Stats Grid */}
        <div className={styles.quickStats}>
          <div className={styles.statCard}>
            <h2>{total}</h2>
            <p>Total Tasks</p>
          </div>
          <div className={styles.statCard}>
            <h2>{completedCount}</h2>
            <p>Completed</p>
          </div>
          <div className={styles.statCard}>
            <h2>{uncompletedCount}</h2>
            <p>Uncompleted</p>
          </div>
          <div className={styles.statCard}>
            <h2>{completionPercent}%</h2>
            <p>Completion</p>
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className={styles.categoryChart}>
          {categories.map((cat, index) => (
            <div key={cat} className={styles.categoryBarWrapper}>
              <div className={styles.categoryLabel}>{cat}</div>
              <div className={styles.barBackground}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${categoryPercentages[index]}%`,
                    backgroundColor: colors[index],
                  }}
                ></div>
              </div>
              <div className={styles.categoryPercent}>
                {categoryPercentages[index]}%
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Next 5 Upcoming Tasks */}
      <div className={styles.upcomingSection}>
        <h2>📅 Next 5 Due Tasks</h2>
        <ul className={styles.upcomingList}>
          {upcomingTasks.map((task) => {
            const [y, m, d] = task.dueDate!.split("-").map(Number);
            const localDate = new Date(y, m - 1, d);
            return (
              <li key={task._id} className={styles.upcomingItem}>
                <div className={styles.taskRow}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task._id)}
                    />
                    <span
                      className={`${styles.taskTitle} ${
                        task.completed ? styles.completed : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </label>

                  <div className={styles.taskRight}>
                    <span className={styles.taskDate}>
                      {localDate.toLocaleDateString()}
                    </span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Priority & Category badges */}
                <div className={styles.badgeRow}>
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
                    <span
                      className={`${styles.badge} ${
                        task.category.toLowerCase() === "work"
                          ? styles.work
                          : task.category.toLowerCase() === "personal"
                          ? styles.personal
                          : task.category.toLowerCase() === "health"
                          ? styles.health
                          : ""
                      }`}
                    >
                      {task.category}
                    </span>
                  )}
                </div>

                {/* Progress bar if due today */}
                {localDate.toDateString() === new Date().toDateString() && (
                  <div className={styles.progressBarWrapper}>
                    <div
                      className={styles.progressBar}
                      style={{ width: task.completed ? "100%" : "0%" }}
                    ></div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
