import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('luna_token')
      
      if (token) {
        try {
          // Set the auth token for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Fetch user data
          const response = await axios.get('/api/auth/me')
          setUser(response.data)
          
          // Check if user is admin
          checkAdminStatus(response.data)
        } catch (err) {
          console.error('Authentication error:', err)
          localStorage.removeItem('luna_token')
          delete axios.defaults.headers.common['Authorization']
        }
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  // Check if user has admin role
  const checkAdminStatus = (userData) => {
    if (!userData) {
      setIsAdmin(false)
      return
    }
    
    // In a real app, we would check user.role from the backend
    // For development purposes, we'll check if the email contains 'admin'
    const hasAdminRole = userData.role === 'admin' || 
                         userData.isAdmin === true || 
                         userData.email?.includes('admin');
    
    setIsAdmin(hasAdminRole)
  }

  // Login with email (magic link)
  const requestLoginLink = async (email) => {
    setLoading(true)
    setError(null)
    
    try {
      await axios.post('/api/auth/request-login', { email })
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send login link')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Verify login token from email
  const verifyLoginToken = async (token) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/auth/verify-login', { token })
      
      // Save the JWT token
      const { token: jwtToken, user: userData } = response.data
      localStorage.setItem('luna_token', jwtToken)
      
      // Set the auth token for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
      
      setUser(userData)
      
      // Check if user is admin
      checkAdminStatus(userData)
      
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired login link')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('luna_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setIsAdmin(false)
    navigate('/login')
  }

  // Request access to Luna
  const requestAccess = async (formData) => {
    setLoading(true)
    setError(null)
    
    try {
      await axios.post('/api/auth/request-access', formData)
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit access request')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Verify access code
  const verifyAccessCode = async (code) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/auth/verify-access-code', { code })
      return response.data.valid
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid access code')
      return false
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    isAdmin,
    requestLoginLink,
    verifyLoginToken,
    logout,
    requestAccess,
    verifyAccessCode,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
