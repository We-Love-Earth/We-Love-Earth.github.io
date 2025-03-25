import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import SacredCard from '../common/SacredCard'
import SacredButton from '../common/SacredButton'
import SacredSymbol from '../common/SacredSymbol'
import axios from 'axios'

/**
 * AuthTest - Component for testing authentication and authorization functionality
 * 
 * This component is used for development and testing purposes to verify that
 * the authentication and authorization systems are working correctly.
 */
const AuthTest = () => {
  const { user, isAdmin, logout } = useAuth()
  const [testResults, setTestResults] = useState([])
  const [loading, setLoading] = useState(false)
  
  const runAuthTest = async (testName, testFn) => {
    setLoading(true)
    try {
      const result = await testFn()
      setTestResults(prev => [
        { 
          name: testName, 
          status: 'success', 
          message: result || 'Test passed successfully' 
        },
        ...prev
      ])
    } catch (err) {
      setTestResults(prev => [
        { 
          name: testName, 
          status: 'error', 
          message: err.message || 'Test failed' 
        },
        ...prev
      ])
    } finally {
      setLoading(false)
    }
  }
  
  // Test user authentication status
  const testAuthStatus = () => {
    return new Promise((resolve) => {
      if (user) {
        resolve(`Authenticated as ${user.email}`)
      } else {
        throw new Error('Not authenticated')
      }
    })
  }
  
  // Test admin role verification
  const testAdminRole = () => {
    return new Promise((resolve) => {
      if (isAdmin) {
        resolve('User has admin privileges')
      } else {
        throw new Error('User does not have admin privileges')
      }
    })
  }
  
  // Test accessing a protected API endpoint
  const testProtectedEndpoint = async () => {
    try {
      const response = await axios.get('/api/protected')
      return `Protected endpoint access successful: ${response.data.message}`
    } catch (err) {
      throw new Error(`Protected endpoint access failed: ${err.message}`)
    }
  }
  
  // Test accessing an admin-only API endpoint
  const testAdminEndpoint = async () => {
    try {
      const response = await axios.get('/api/admin')
      return `Admin endpoint access successful: ${response.data.message}`
    } catch (err) {
      throw new Error(`Admin endpoint access failed: ${err.message}`)
    }
  }
  
  // Clear test results
  const clearResults = () => {
    setTestResults([])
  }
  
  return (
    <SacredCard title="Authentication & Authorization Testing" symbol="consciousness">
      <div className="space-y-6">
        <div className="bg-sacred-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-sacred-800 mb-2">Current Authentication State</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sacred-700 w-32">Authenticated:</span>
              <span className={`font-medium ${user ? 'text-earth-600' : 'text-red-500'}`}>
                {user ? 'Yes' : 'No'}
              </span>
            </div>
            
            {user && (
              <>
                <div className="flex items-center">
                  <span className="text-sacred-700 w-32">User Email:</span>
                  <span className="font-medium text-sacred-800">{user.email}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sacred-700 w-32">Admin Role:</span>
                  <span className={`font-medium ${isAdmin ? 'text-earth-600' : 'text-sacred-800'}`}>
                    {isAdmin ? 'Yes' : 'No'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SacredButton 
            onClick={() => runAuthTest('Authentication Status', testAuthStatus)}
            variant="sacred"
            disabled={loading}
          >
            Test Auth Status
          </SacredButton>
          
          <SacredButton 
            onClick={() => runAuthTest('Admin Role Check', testAdminRole)}
            variant="sacred"
            disabled={loading}
          >
            Test Admin Role
          </SacredButton>
          
          <SacredButton 
            onClick={() => runAuthTest('Protected Endpoint', testProtectedEndpoint)}
            variant="sacred"
            disabled={loading}
          >
            Test Protected API
          </SacredButton>
          
          <SacredButton 
            onClick={() => runAuthTest('Admin Endpoint', testAdminEndpoint)}
            variant="sacred"
            disabled={loading}
          >
            Test Admin API
          </SacredButton>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-4">
            <SacredSymbol symbol="infinity" size="medium" color="sacred" animate={true} />
            <span className="ml-3 text-sacred-600">Running test...</span>
          </div>
        )}
        
        {testResults.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-sacred-800">Test Results</h3>
              <SacredButton 
                onClick={clearResults}
                variant="cosmic"
                size="small"
              >
                Clear Results
              </SacredButton>
            </div>
            
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-md ${
                    result.status === 'success' ? 'bg-earth-50 border border-earth-100' : 'bg-red-50 border border-red-100'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {result.status === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-earth-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h4 className={`text-sm font-medium ${
                        result.status === 'success' ? 'text-earth-800' : 'text-red-800'
                      }`}>
                        {result.name}
                      </h4>
                      <p className={`text-sm ${
                        result.status === 'success' ? 'text-earth-600' : 'text-red-600'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SacredCard>
  )
}

export default AuthTest
