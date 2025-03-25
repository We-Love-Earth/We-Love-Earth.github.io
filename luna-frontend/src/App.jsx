import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './contexts/AuthContext'
import { CreditProvider } from './contexts/CreditContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Layouts
import MainLayout from './components/layout/MainLayout'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AccessRequestPage from './pages/AccessRequestPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import TestingPage from './pages/TestingPage'
import NotFoundPage from './pages/NotFoundPage'

// Auth components
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { t } = useTranslation()
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <AuthProvider>
      <CreditProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="request-access" element={<AccessRequestPage />} />
              <Route 
                path="chat" 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute requireAdmin={true} redirectTo="/">
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              {isDevelopment && (
                <Route path="testing" element={<TestingPage />} />
              )}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </CreditProvider>
    </AuthProvider>
  )
}

export default App
