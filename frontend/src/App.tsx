import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import Tasks from "./Pages/Tasks/Tasks";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Settings from "./Pages/Settings/Settings";
import Sidebar from "./Components/SideBar/SideBar";
import PrivateRoute from "./Components/PrivateRoute";
import { useAuth, Theme } from "./Contexts/AuthContext";

function App() {
  const { token, user } = useAuth();

  // Apply user's theme on initial load
  useEffect(() => {
    if (user?.theme) {
      const root = document.documentElement;
      Object.entries(user.theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, [user]);

  return (
    <Router>
      {token && <Sidebar />}

      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
