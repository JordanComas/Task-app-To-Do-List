// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Calendar from "./Pages/Calendar/Calendar";
import Tasks from "./Pages/Tasks/Tasks";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Layout wraps all pages */}
        <Route path="/" element={<Layout />}>
          {/* Default route */}
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
