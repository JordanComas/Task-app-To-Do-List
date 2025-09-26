import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Task } from "../../types";
import { fetchTasks } from "../../Services/taskServices";
import { useAuth } from "../../Contexts/AuthContext";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return; // wait until token is available

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

  const completedCount = tasks.filter((t) => t.completed).length;
  const uncompletedCount = tasks.length - completedCount;
  const total = tasks.length;
  const completedPercent = total
    ? Math.round((completedCount / total) * 100)
    : 0;

  const dataChart = [
    { name: "Completed", value: completedCount, color: "#4caf50" },
    { name: "Uncompleted", value: uncompletedCount, color: "#f44336" },
  ];

  const COLORS = ["#4caf50", "#f44336"];

  return (
    <div className={styles.pageWrapper}>
      <h1>Dashboard</h1>
      <PieChart width={300} height={300}>
        <Pie
          data={dataChart}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          label={false}
        >
          {dataChart.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>

        {/* Tooltip to show numbers */}
        <Tooltip formatter={(value: number) => `${value} tasks`} />

        {/* Center percentage */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "24px", fontWeight: "bold" }}
        >
          {completedPercent}%
        </text>
      </PieChart>

      {/* Legend with numbers */}
      <div className={styles.legend}>
        {dataChart.map((item) => (
          <div key={item.name} className={styles.legendItem}>
            <div
              style={{ width: 20, height: 20, backgroundColor: item.color }}
            ></div>
            <span>
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
      <p>
        For each page (Dashboard, Calendar, Tasks):For each page (Dashboard,
        Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):For each
        page (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar,
        Tasks):For each page (Dashboard, Calendar, Tasks):For each page
        (Dashboard, Calendar, Tasks):For each page (Dashboard, Calendar, Tasks):
      </p>
    </div>
  );
};

export default Dashboard;
