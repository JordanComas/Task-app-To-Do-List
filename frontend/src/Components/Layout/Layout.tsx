import React from "react";
import Sidebar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const Layout: React.FC = () => {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Outlet /> {/* Current page goes here */}
      </div>
    </div>
  );
};

export default Layout;
