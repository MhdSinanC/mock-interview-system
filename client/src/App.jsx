import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SelectDifficulty from './pages/SelectDifficulty';
import InterviewRoom from './pages/InterviewRoom';
import ResultAnalysis from './pages/ResultAnalysis';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Candidate Routes (Restricted from Administrators) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute candidateOnly={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/select"
                  element={
                    <ProtectedRoute candidateOnly={true}>
                      <SelectDifficulty />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interview"
                  element={
                    <ProtectedRoute candidateOnly={true}>
                      <InterviewRoom />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results/:id"
                  element={
                    <ProtectedRoute>
                      <ResultAnalysis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute candidateOnly={true}>
                      <History />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
