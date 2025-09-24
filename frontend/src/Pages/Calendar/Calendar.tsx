import React, { useEffect, useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { fetchTasks } from "../../Services/taskServices";
import { Task } from "../../types";
import { useAuth } from "../../Contexts/AuthContext";
import styles from "./Calendar.module.css";
import { parse, format } from "date-fns";

const Calendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { token } = useAuth();
  const taskListRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchTasks(token).then(setTasks);
  }, [token]);

  const parseLocalDate = (dateStr: string) =>
    parse(dateStr, "yyyy-MM-dd", new Date());

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

  // Track scroll for shadow
  useEffect(() => {
    const el = taskListRef.current;
    if (!el) return;

    const onScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.calendarContainer}>
        <h1>📅 Task Calendar</h1>

        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{ dayWithTask: hasTasks }}
          modifiersClassNames={{ dayWithTask: "dayWithTask" }}
        />

        {selectedDate && (
          <div
            ref={taskListRef}
            className={`${styles.taskListWrapper} ${
              scrolled ? styles.scrolled : ""
            }`}
          >
            <h2>Tasks on {format(selectedDate, "PPP")}</h2>
            {tasksForDate(selectedDate).length === 0 ? (
              <p>No tasks due on this day.</p>
            ) : (
              <ul className={styles.tasksUl}>
                {tasksForDate(selectedDate).map((task) => (
                  <li
                    key={task._id}
                    className={
                      task.completed ? styles.completed : styles.notCompleted
                    }
                  >
                    {task.title} {task.completed ? "✅" : "❌"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
