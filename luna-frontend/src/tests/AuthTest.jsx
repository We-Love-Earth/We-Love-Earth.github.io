import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SacredButton from '../components/common/SacredButton'
import SacredCard from '../components/common/SacredCard'
import SacredSymbol from '../components/common/SacredSymbol'

/**
 * AuthTest - A component for testing authentication and authorization
 * 
 * This component allows developers to:
 * 1. Test login with different user types (regular user, admin)
 * 2. Verify protected routes are working correctly
 * 3. Check if admin-only routes are properly restricted
 */
const AuthTest = () => {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  
  const [testEmail, setTestEmail] = useState('')
  const [testResults, setTestResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Log test result
  const logResult = (test, result, details = '') => {
    setTestResults(prev => [
      { 
        id: Date.now(), 
        timestamp: new Date().toLocaleTimeString(), 
        test, 
        result, 
        details 
      },
      ...prev
    ])
  }
  
  // Test login
  const testLogin = async (email, isAdmin = false) => {
    setIsLoading(true)
    try {
      // In a real app, this would make an API call
      // For testing, we'll simulate a successful login
      const mockUser = {
        id: 'test-user-id',
        email,
        name: isAdmin ? 'Admin User' : 'Regular User',
        credits: 100,
        isAdmin
      }
      
      // Store in localStorage to simulate persistence
      localStorage.setItem('luna_user', JSON.stringify(mockUser))
      localStorage.setItem('luna_token', 'mock-token-for-testing')
      
      // Update auth context
      login(mockUser)
      
      logResult(
        `Login as ${isAdmin ? 'admin' : 'regular user'}`,
        'success',
        `Logged in with email: ${email}`
      )
    } catch (error) {
      logResult(
        `Login as ${isAdmin ? 'admin' : 'regular user'}`,
        'error',
        error.message
      )
    } finally {
      setIsLoading(false)
    }
  }
  
  // Test logout
  const testLogout = () => {
    try {
      logout()
      logResult('Logout', 'success', 'User logged out successfully')
    } catch (error) {
      logResult('Logout', 'error', error.message)
    }
  }
  
  // Test navigation to protected route
  const testProtectedRoute = (route) => {
    try {
      navigate(route)
      logResult(
        `Navigate to protected route: ${route}`,
        'success',
        `Navigated to ${route}`
      )
    } catch (error) {
      logResult(
        `Navigate to protected route: ${route}`,
        'error',
        error.message
      )
    }
  }
  
  // Clear test results
  const clearResults = () => {
    setTestResults([])
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <SacredCard title="Authentication & Authorization Test" symbol="consciousness" variant="sacred">
        <div className="mb-6">
          <p className="text-sacred-700 mb-4">
            This component allows you to test authentication and authorization functionality.
            Use the controls below to simulate different user types and test access to protected routes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="w-full">
              <label htmlFor="testEmail" className="block text-sm font-medium text-sacred-700 mb-1">
                Test Email
              </label>
              <input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter test email"
                className="w-full p-2 border border-sacred-300 rounded-md focus:ring-2 focus:ring-sacred-500 focus:border-sacred-500"
              />
            </div>
            
            <div className="flex gap-2 self-end">
              <SacredButton 
                onClick={() => testLogin(testEmail, false)}
                disabled={isLoading || !testEmail}
                variant="sacred"
                size="small"
              >
                Login as User
              </SacredButton>
              
              <SacredButton 
                onClick={() => testLogin(testEmail, true)}
                disabled={isLoading || !testEmail}
                variant="cosmic"
                size="small"
              >
                Login as Admin
              </SacredButton>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <SacredButton 
              onClick={testLogout}
              disabled={isLoading || !user}
              variant="secondary"
              size="small"
            >
              Test Logout
            </SacredButton>
            
            <SacredButton 
              onClick={() => testProtectedRoute('/chat')}
              disabled={isLoading || !user}
              variant="earth"
              size="small"
            >
              Test Chat Route
            </SacredButton>
            
            <SacredButton 
              onClick={() => testProtectedRoute('/profile')}
              disabled={isLoading || !user}
              variant="earth"
              size="small"
            >
              Test Profile Route
            </SacredButton>
            
            <SacredButton 
              onClick={() => testProtectedRoute('/admin')}
              disabled={isLoading || !user}
              variant="cosmic"
              size="small"
            >
              Test Admin Route
            </SacredButton>
          </div>
          
          <div className="bg-sacred-50 p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sacred-800">Current User Status</h3>
              
              {user ? (
                <span className="px-2 py-1 bg-earth-100 text-earth-800 text-xs rounded-full">
                  Logged In
                </span>
              ) : (
                <span className="px-2 py-1 bg-cosmic-100 text-cosmic-800 text-xs rounded-full">
                  Logged Out
                </span>
              )}
            </div>
            
            {user && (
              <div className="text-sm text-sacred-700">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Role:</strong> {user.isAdmin ? 'Admin' : 'Regular User'}</p>
                <p><strong>Credits:</strong> {user.credits}</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sacred-800">Test Results</h3>
            <SacredButton 
              onClick={clearResults}
              variant="secondary"
              size="small"
            >
              Clear Results
            </SacredButton>
          </div>
          
          <div className="border border-sacred-200 rounded-md overflow-hidden">
            {testResults.length === 0 ? (
              <div className="p-4 text-sacred-500 text-center">
                No test results yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-sacred-200">
                  <thead className="bg-sacred-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sacred-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sacred-500 uppercase tracking-wider">
                        Test
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sacred-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sacred-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-sacred-200">
                    {testResults.map((result) => (
                      <tr key={result.id}>
                        <td className="px-4 py-2 text-sm text-sacred-500">
                          {result.timestamp}
                        </td>
                        <td className="px-4 py-2 text-sm text-sacred-700">
                          {result.test}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            result.result === 'success'
                              ? 'bg-earth-100 text-earth-800'
                              : 'bg-cosmic-100 text-cosmic-800'
                          }`}>
                            {result.result}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-sacred-700">
                          {result.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </SacredCard>
    </div>
  )
}

export default AuthTest
