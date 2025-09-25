import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SideBar.module.css";
import Logout from "../LogoutButton/LogoutButton";

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Menu</h2>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/tasks">Tasks</NavLink>
        </li>
        <li>
          <Logout />
        </li>
      </ul>
      <p className={styles.creator}>Made by Jordan Comas</p>
    </div>
  );
};

export default Sidebar;
