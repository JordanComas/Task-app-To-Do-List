import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SideBar.module.css";

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Menu</h2>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/calendar">Calendar</NavLink>
        </li>
        <li>
          <NavLink to="/tasks">Tasks</NavLink>
        </li>
      </ul>
      <p className={styles.creator}>Made by Jordan Comas</p>
    </div>
  );
};

export default Sidebar; // <-- export is required
