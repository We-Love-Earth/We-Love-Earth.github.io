import { createContext, useContext, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import SacredNotification from '../components/common/SacredNotification'

/**
 * NotificationContext - Context for managing notifications across the application
 * 
 * This context provides a way to show and manage notifications from anywhere in the app,
 * maintaining the sacred aesthetic of Luna and providing a consistent user experience.
 */

// Create the context
const NotificationContext = createContext()

// Custom hook for using the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  
  // Add a new notification
  const addNotification = useCallback((notification) => {
    const id = notification.id || uuidv4()
    setNotifications(prev => [...prev, { ...notification, id }])
    return id
  }, [])
  
  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])
  
  // Helper functions for common notification types
  const showSuccess = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'success', title, message, ...options })
  }, [addNotification])
  
  const showError = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'error', title, message, ...options })
  }, [addNotification])
  
  const showInfo = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'info', title, message, ...options })
  }, [addNotification])
  
  const showWarning = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'warning', title, message, ...options })
  }, [addNotification])
  
  // Value to be provided by the context
  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render all active notifications */}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <SacredNotification
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
            show={true}
            style={{
              top: `${(index * 4) + 1}rem`
            }}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export default NotificationContext
