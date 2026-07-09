import { Routes, Route } from "react-router-dom";

import App from "../App";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import DocumentPage from "../pages/DocumentPage";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>

      <Route path="/" element={<App />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/d/:code"
        element={<DocumentPage />}
      />

    </Routes>
  );
}