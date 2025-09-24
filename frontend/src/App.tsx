import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Tasks from "./Pages/Tasks/Tasks";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Calendar from "./Pages/Calendar/Calendar";
import Sidebar from "./Components/SideBar/SideBar";
import PrivateRoute from "./Components/PrivateRoute";
import { useAuth } from "./Contexts/AuthContext";

function App() {
  const { token } = useAuth();

  return (
    <Router>
      {token && <Sidebar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Calendar />
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
      </Routes>
    </Router>
  );
}

export default App;
