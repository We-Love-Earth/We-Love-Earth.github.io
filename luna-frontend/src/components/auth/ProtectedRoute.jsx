import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import SacredSymbol from '../common/SacredSymbol'

/**
 * ProtectedRoute - Component for protecting routes based on authentication and roles
 * 
 * This component can be used to:
 * 1. Protect routes that require authentication
 * 2. Protect routes that require specific roles (e.g., admin)
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {boolean} props.requireAdmin - Whether the route requires admin privileges
 * @param {string} props.redirectTo - Path to redirect to if unauthorized (defaults to /login)
 */
const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/login' 
}) => {
  const { user, loading, isAdmin } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuthorization = () => {
      // Not authorized if not logged in
      if (!user) {
        setIsAuthorized(false)
        setIsChecking(false)
        return
      }
      
      // Check if admin is required
      if (requireAdmin && !isAdmin) {
        setIsAuthorized(false)
        setIsChecking(false)
        return
      }
      
      // User is authorized
      setIsAuthorized(true)
      setIsChecking(false)
    }
    
    if (!loading) {
      checkAuthorization()
    }
  }, [user, loading, isAdmin, requireAdmin])

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="sacred-card animate-pulse-slow">
          <div className="flex items-center">
            <SacredSymbol symbol="infinity" size="large" color="sacred" animate={true} />
            <p className="ml-3 text-sacred-600 font-display text-xl">Verifying sacred access...</p>
          </div>
        </div>
      </div>
    )
  }

  return isAuthorized ? children : <Navigate to={redirectTo} replace />
}

export default ProtectedRoute
