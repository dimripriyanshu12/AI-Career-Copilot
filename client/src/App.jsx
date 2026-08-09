import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import MyResumes from "./pages/MyResumes";
import ResumeDetail from "./pages/ResumeDetail";

import ProtectedRoute from "./components/ProtectedRoute";
import JobMatcher from "./pages/JobMatcher";
import ResumeBuilder from "./pages/ResumeBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/analyzer" element={<ResumeAnalyzer />} />

          <Route path="/resumes" element={<MyResumes />} />

          <Route path="/resume/:id" element={<ResumeDetail />} />
        </Route>

        <Route path="/job-matcher" element={<JobMatcher />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
