import { Routes, Route } from "react-router-dom";

import App from "../App";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import DocumentPage from "../pages/DocumentPage";

import ProtectedRoute from "../components/ProtectedRoute";
import Patients from "../pages/patients/Patients";
import Patient from "../pages/patients/Patient";
import NewPatient from "../pages/patients/NewPatient";

import Documents from "../pages/documents/Documents";
import Document from "../pages/documents/Document";
import NewDocument from "../pages/documents/NewDocument";
import Layout from "../components/layout/Layout";


export default function AppRouter() {
  return (
    <Routes>

      <Route path="/" element={<App />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
             <Layout>
            <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
         path="/dashboard"
         element={
         <ProtectedRoute>
         <Layout>
         <Dashboard />
         </Layout>
         </ProtectedRoute>
        }
      />

      <Route
        path="/d/:code"
        element={<DocumentPage />}
      />

      <Route
  path="/patients"
  element={
    <ProtectedRoute>
      <Layout>
      <Patients />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/patients/new"
  element={
    <ProtectedRoute>
      <Layout>
      <NewPatient />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/patients/:id"
  element={
    <ProtectedRoute>
      <Layout>
      <Patient />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/documents"
  element={
    <ProtectedRoute>
      <Layout>
      <Documents />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/documents/:id"
  element={
    <ProtectedRoute>
      <Layout>
      <Document />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/documents/new/:patientId"
  element={
    <ProtectedRoute>
      <Layout>
      <NewDocument />
      </Layout>
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}