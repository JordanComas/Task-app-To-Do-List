import React, { useState, useEffect } from "react";
import styles from "./Settings.module.css";
import { useAuth, Theme } from "../../Contexts/AuthContext";
import axios from "axios";

const Settings: React.FC = () => {
  const { token, user, login, setTheme } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Selected theme state
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(
    user?.theme || null
  );

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";
  const headers = { Authorization: `Bearer ${token}` };

  // Define your theme options here
  const themes: { name: string; theme: Theme }[] = [
    {
      name: "Default",
      theme: {
        "--primary-bg": "#F3F3F4",
        "--primary-text": "#34312D",
        "--secondary-bg": "#D9C5B2",
        "--button-bg": "#34312D",
        "--button-text": "#F3F3F4",
        "--button-hover-bg": "#7E7F83",
        "--button-hover-text": "#14110F",
      },
    },
    {
      name: "Pink",
      theme: {
        "--primary-bg": "#F3F3F4",
        "--primary-text": "#D88C9A",
        "--secondary-bg": "#F1E3D3",
        "--button-bg": "#34312D",
        "--button-text": "#F3F3F4",
        "--button-hover-bg": "#fff",
        "--button-hover-text": "#14110F",
      },
    },
    {
      name: "Gray",
      theme: {
        "--primary-bg": "#7E7F83",
        "--primary-text": "#F3F3F4",
        "--secondary-bg": "#D9C5B2",
        "--button-bg": "#34312D",
        "--button-text": "#F3F3F4",
        "--button-hover-bg": "#14110F",
        "--button-hover-text": "#F3F3F4",
      },
    },
    {
      name: "Dark",
      theme: {
        "--primary-bg": "#34312D",
        "--primary-text": "#F3F3F4",
        "--secondary-bg": "#7E7F83",
        "--button-bg": "#14110F",
        "--button-text": "#F3F3F4",
        "--button-hover-bg": "#D9C5B2",
        "--button-hover-text": "#34312D",
      },
    },
    {
      name: "Black",
      theme: {
        "--primary-bg": "#14110F",
        "--primary-text": "#F3F3F4",
        "--secondary-bg": "#34312D",
        "--button-bg": "#D9C5B2",
        "--button-text": "#34312D",
        "--button-hover-bg": "#7E7F83",
        "--button-hover-text": "#F3F3F4",
      },
    },
  ];

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/auth/update-profile`,
        { name, email, theme: selectedTheme }, // send selectedTheme object
        { headers }
      );
      login(token!, res.data.user);
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    }
  };

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

  const handleDeleteTasks = async () => {
    if (!window.confirm("Are you sure you want to delete all tasks?")) return;
    try {
      await axios.delete(`${API_URL}/tasks`, { headers });
      setMessage("All tasks deleted successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to delete tasks");
    }
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setTheme(theme); // update AuthContext and apply CSS variables
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.settingTitle}>Settings</h2>

      {/* Name */}
      <div className={styles.section}>
        <h3>Change Name</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={handleUpdateProfile}>Update Name</button>
      </div>

      {/* Email */}
      <div className={styles.section}>
        <h3>Change Email</h3>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={handleUpdateProfile}>Update Email</button>
      </div>

      {/* Password */}
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

      {/* Color Theme */}
      <div className={styles.section}>
        <h3>Color Theme</h3>
        <div className={styles.colorThemeSection}>
          {themes.map((t) => (
            <div
              key={t.name}
              style={{ display: "inline-block", margin: "0 1rem" }}
            >
              <div
                className={selectedTheme === t.theme ? styles.active : ""}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: t.theme["--primary-text"],
                  borderRadius: 8,
                  cursor: "pointer",
                  border: "2px solid #34312D",
                }}
                onClick={() => handleThemeSelect(t.theme)}
              />
              <div style={{ textAlign: "center", marginTop: 4 }}>{t.name}</div>
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
