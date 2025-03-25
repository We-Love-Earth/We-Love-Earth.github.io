import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import axios from 'axios'
import SacredCard from '../common/SacredCard'
import SacredButton from '../common/SacredButton'
import SacredSymbol from '../common/SacredSymbol'
import { useNotification } from '../../contexts/NotificationContext'
import AuditService from '../../services/AuditService'

/**
 * AdminCreditManagement - Component for managing user credits
 * 
 * This component allows administrators to view and manage user credits,
 * including adding credits manually and viewing credit usage history.
 */
const AdminCreditManagement = () => {
  const { t } = useTranslation()
  const { showSuccess, showError, showInfo } = useNotification()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [creditAmount, setCreditAmount] = useState(100)
  const [searchTerm, setSearchTerm] = useState('')
  const [creditHistory, setCreditHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])
  
  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      showError(
        'Error Loading Users', 
        'Could not load users. Please try again later.'
      )
    } finally {
      setLoading(false)
    }
  }
  
  // Handle user selection for detailed view
  const handleSelectUser = async (user) => {
    setSelectedUser(user)
    
    // Fetch credit history for selected user
    await fetchCreditHistory(user._id)
  }
  
  // Fetch credit history for a user
  const fetchCreditHistory = async (userId) => {
    setLoadingHistory(true)
    try {
      const response = await axios.get(`/api/admin/users/${userId}/credits/history`)
      setCreditHistory(response.data)
      
      // Log audit event
      AuditService.logAdminEvent(
        'Credit History Viewed',
        `Admin viewed credit history for user ID: ${userId}`,
        'info',
        { userId }
      )
    } catch (error) {
      console.error('Error fetching credit history:', error)
      showError(
        'Error Loading Credit History', 
        'Could not load credit history. Please try again.'
      )
      
      // Log error event
      AuditService.logErrorEvent(
        'Credit History Fetch Failed',
        `Failed to retrieve credit history for user ID: ${userId}`,
        'low',
        { userId, error: error.message }
      )
    } finally {
      setLoadingHistory(false)
    }
  }
  
  // Handle adding credits to a user
  const handleAddCredits = async (e) => {
    e.preventDefault()
    
    if (!selectedUser) {
      showError('Error', 'Please select a user first')
      return
    }
    
    if (!creditAmount || creditAmount <= 0) {
      showError('Error', 'Please enter a valid number of credits')
      return
    }
    
    try {
      await axios.post(`/api/admin/users/${selectedUser._id}/credits/add`, {
        amount: creditAmount,
        reason: 'Manual addition by admin'
      })
      
      // Update local state
      setUsers(users.map(user => 
        user._id === selectedUser._id 
          ? { ...user, credits: user.credits + creditAmount } 
          : user
      ))
      
      // Update selected user
      setSelectedUser({
        ...selectedUser,
        credits: selectedUser.credits + creditAmount
      })
      
      // Refresh credit history
      await fetchCreditHistory(selectedUser._id)
      
      showSuccess(
        'Credits Added', 
        `${creditAmount} credits have been added to ${selectedUser.name || selectedUser.email}.`
      )
      
      // Log audit event
      AuditService.logAdminEvent(
        'Credits Added',
        `Admin added ${creditAmount} credits to user ${selectedUser.email}`,
        'medium',
        { 
          userId: selectedUser._id,
          userEmail: selectedUser.email,
          creditsAdded: creditAmount,
          reason: 'Manual addition by admin'
        }
      )
    } catch (error) {
      console.error('Error adding credits:', error)
      showError(
        'Error Adding Credits', 
        'Could not add credits. Please try again.'
      )
      
      // Log error event
      AuditService.logErrorEvent(
        'Credit Addition Failed',
        `Failed to add credits to user ${selectedUser.email}`,
        'medium',
        { 
          userId: selectedUser._id,
          userEmail: selectedUser.email,
          creditsAttempted: creditAmount,
          reason: 'Manual addition by admin',
          error: error.message
        }
      )
    }
  }
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.name && user.name.toLowerCase().includes(searchLower))
      )
    }
    
    return true
  })
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }
  
  return (
    <SacredCard title="Credit Management" symbol="spiral">
      <div className="space-y-6">
        {/* Credit System Info */}
        <div className="bg-sacred-50 border border-sacred-200 p-4 rounded-md">
          <h3 className="text-sacred-900 font-medium mb-2">Luna Credit System</h3>
          <p className="text-sacred-700 text-sm">
            Luna operates on a credit system to manage API usage:
          </p>
          <ul className="list-disc list-inside text-sacred-700 text-sm mt-1">
            <li>6 credits per million tokens of input</li>
            <li>30 credits per million tokens of output</li>
            <li>Credits can be purchased through Ko-fi subscriptions</li>
            <li>Administrators can manually add credits to user accounts</li>
          </ul>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-sacred-200 focus:outline-none focus:ring-2 focus:ring-sacred-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sacred-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User List */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-md shadow overflow-hidden">
              <div className="p-3 bg-sacred-50 border-b border-sacred-100">
                <h3 className="text-sacred-900 font-medium">Users</h3>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <SacredSymbol symbol="infinity" size="medium" color="sacred" animate={true} />
                  <span className="ml-3 text-sacred-600">Loading users...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sacred-600">No users found matching your criteria.</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-sacred-100 max-h-96 overflow-y-auto"
                >
                  {filteredUsers.map(user => (
                    <motion.div
                      key={user._id}
                      variants={itemVariants}
                      className={`p-4 hover:bg-sacred-50 cursor-pointer ${
                        selectedUser && selectedUser._id === user._id ? 'bg-sacred-50' : ''
                      }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <div>
                        <h3 className="text-sacred-900 font-medium">{user.name || 'Unnamed User'}</h3>
                        <p className="text-sacred-600 text-sm">{user.email}</p>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cosmic-100 text-cosmic-800">
                            {user.credits || 0} Credits
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          
          {/* User Details and Credit Management */}
          <div className="md:col-span-2">
            {selectedUser ? (
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="p-4 bg-sacred-50 border-b border-sacred-100">
                  <h3 className="text-sacred-900 font-medium">Credit Management: {selectedUser.name || selectedUser.email}</h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sacred-600 text-sm">Email</p>
                      <p className="text-sacred-900">{selectedUser.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sacred-600 text-sm">Current Credits</p>
                      <p className="text-sacred-900 text-xl font-medium">{selectedUser.credits || 0}</p>
                    </div>
                    
                    <div>
                      <p className="text-sacred-600 text-sm">Last Login</p>
                      <p className="text-sacred-900">{formatDate(selectedUser.lastLoginAt)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sacred-600 text-sm">Account Created</p>
                      <p className="text-sacred-900">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                  
                  {/* Add Credits Form */}
                  <div className="bg-sacred-50 p-4 rounded-md mb-6">
                    <h4 className="text-sacred-900 font-medium mb-3">Add Credits</h4>
                    <div className="flex items-end space-x-4">
                      <div className="flex-grow">
                        <label className="block text-sacred-700 text-sm mb-1">Credit Amount</label>
                        <input
                          type="number"
                          min="1"
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-md border border-sacred-200 focus:outline-none focus:ring-2 focus:ring-sacred-500"
                        />
                      </div>
                      <SacredButton
                        onClick={handleAddCredits}
                        variant="cosmic"
                      >
                        Add Credits
                      </SacredButton>
                    </div>
                  </div>
                  
                  {/* Credit History */}
                  <div>
                    <h4 className="text-sacred-900 font-medium mb-3">Credit History</h4>
                    
                    {loadingHistory ? (
                      <div className="flex justify-center items-center py-6">
                        <SacredSymbol symbol="infinity" size="small" color="sacred" animate={true} />
                        <span className="ml-3 text-sacred-600">Loading history...</span>
                      </div>
                    ) : creditHistory.length === 0 ? (
                      <div className="py-6 text-center bg-gray-50 rounded-md">
                        <p className="text-sacred-600">No credit history available.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-sacred-200">
                          <thead className="bg-sacred-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sacred-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sacred-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sacred-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sacred-500 uppercase tracking-wider">
                                Reason
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-sacred-100">
                            {creditHistory.map((entry, index) => (
                              <tr key={index} className="hover:bg-sacred-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-sacred-900">
                                  {formatDate(entry.timestamp)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    entry.type === 'add' 
                                      ? 'bg-earth-100 text-earth-800' 
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {entry.type === 'add' ? 'Added' : 'Used'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-sacred-900">
                                  {entry.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-sacred-600">
                                  {entry.reason || 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-md shadow p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <SacredSymbol symbol="spiral" size="large" color="sacred" />
                  <p className="mt-4 text-sacred-600">Select a user to manage their credits</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SacredCard>
  )
}

export default AdminCreditManagement
