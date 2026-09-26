import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DispatchConsolePage } from './pages/DispatchConsolePage';
import { JobsPage } from './pages/JobsPage';
import { InventoryPage } from './pages/InventoryPage';
import { SlaPage } from './pages/SlaPage';
import { TechniciansPage } from './pages/TechniciansPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <WebSocketProvider>
            <Routes>
              {/* Public Auth Route */}
              <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route
              path="dispatch"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DISPATCHER']}>
                  <DispatchConsolePage />
                </ProtectedRoute>
              }
            />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route
              path="sla"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DISPATCHER']}>
                  <SlaPage />
                </ProtectedRoute>
              }
            />
            <Route path="technicians" element={<TechniciansPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
          </WebSocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
