import React, { useState } from "react";
import styles from "./Settings.module.css";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";

const Settings: React.FC = () => {
  const { token, user, logout, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("#F3F3F4");
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

  const headers = { Authorization: `Bearer ${token}` };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/auth/update-profile`,
        { name, email, theme: selectedTheme },
        { headers }
      );
      login(token!, res.data.user);
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/auth/update-password`,
        { password },
        { headers }
      );
      setMessage("Password updated successfully!");
      setPassword("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to update password");
    }
  };

  // Delete all tasks
  const handleDeleteTasks = async () => {
    if (!window.confirm("Are you sure you want to delete all tasks?")) return;
    try {
      await axios.delete(`${API_URL}/tasks`, { headers });
      setMessage("All tasks deleted successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to delete tasks");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.settingTitle}>Settings</h2>

      {/* Name Section */}
      <div className={styles.section}>
        <h3>Change Name</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleUpdateProfile}>Update Name</button>
      </div>

      {/* Email Section */}
      <div className={styles.section}>
        <h3>Change Email</h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleUpdateProfile}>Update Email</button>
      </div>

      {/* Password Section */}
      <div className={styles.section}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleUpdatePassword}>Update Password</button>
      </div>

      {/* Color Theme Section */}
      <div className={styles.section}>
        <h3>Color Theme</h3>
        <div className={styles.colorThemeSection}>
          {[
            { color: "#F3F3F4", name: "Light" },
            { color: "#D9C5B2", name: "Beige" },
            { color: "#7E7F83", name: "Gray" },
            { color: "#34312D", name: "Dark" },
            { color: "#14110F", name: "Black" },
          ].map((theme) => (
            <div key={theme.name}>
              <div
                className={`${styles.colorSwatch} ${
                  selectedTheme === theme.color ? styles.active : ""
                }`}
                style={{ backgroundColor: theme.color }}
                onClick={() => setSelectedTheme(theme.color)}
              ></div>
              <div className={styles.colorLabel}>{theme.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete All Tasks */}
      <div className={styles.section}>
        <h3>Delete All Tasks</h3>
        <button className={styles.deleteBtn} onClick={handleDeleteTasks}>
          Delete All Tasks
        </button>
      </div>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default Settings;
