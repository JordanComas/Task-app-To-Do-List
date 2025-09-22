import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // or react-day-picker etc.
import { fetchTasks } from "../../Services/taskServices";
import { Task } from "../../types";
import styles from "./CalendarPage.module.css";
import { useAuth } from "../../Contexts/AuthContext";

const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const loadTasks = async () => {
      try {
        const data = await fetchTasks(token);

        // Sort: completed tasks first
        const sorted = data.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? -1 : 1;
        });

        setTasks(sorted);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      }
    };

    loadTasks();
  }, [token]);

  const tasksForDate = (date: Date) => {
    // filter tasks matching date
    return tasks.filter(
      (task) => new Date(task.dueDate).toDateString() === date.toDateString()
    );
  };

  return (
    <div className={styles.calendarContainer}>
      <h1>Calendar</h1>
      <Calendar
        onChange={(date: Date) => setSelectedDate(date)}
        value={selectedDate}
        tileContent={({ date, view }) => {
          // view === "month"
          const t = tasksForDate(date);
          if (t.length > 0) {
            return <div className={styles.taskIndicator}></div>;
          }
          return null;
        }}
      />
      <div className={styles.taskList}>
        <h2>Tasks for {selectedDate.toDateString()}</h2>
        {tasksForDate(selectedDate).map((task) => (
          <div key={task._id} className={styles.taskItem}>
            {task.title}
          </div>
        ))}
        {tasksForDate(selectedDate).length === 0 && <p>No tasks</p>}
        <button className={styles.addForDateBtn}>+ Add Task</button>
      </div>
    </div>
  );
};

export default CalendarPage;
