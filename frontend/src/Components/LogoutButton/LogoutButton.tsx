import React from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./LogoutButton.module.css";

const LogoutButton: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <button className={styles.logoutBtn} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
