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
 * AdminUserManagement - Component for managing users in the admin panel
 * 
 * This component allows administrators to view, approve, reject, and delete users.
 */
const AdminUserManagement = () => {
  const { t } = useTranslation()
  const { showSuccess, showError, showInfo } = useNotification()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
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
  
  // Handle user approval
  const handleApproveUser = async (userId) => {
    try {
      await axios.post(`/api/admin/users/${userId}/approve`)
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, manuallyApproved: true } 
          : user
      ))
      
      showSuccess(
        'User Approved', 
        'The user has been approved successfully.'
      )
      
      // Log audit event
      AuditService.logAdminEvent(
        'User Approved',
        `Admin approved user with ID: ${userId}`,
        'info',
        { userId }
      )
    } catch (error) {
      console.error('Error approving user:', error)
      showError(
        'Error Approving User', 
        'Could not approve user. Please try again.'
      )
      
      // Log error event
      AuditService.logErrorEvent(
        'User Approval Failed',
        `Failed to approve user with ID: ${userId}`,
        'medium',
        { userId, error: error.message }
      )
    }
  }
  
  // Handle user rejection
  const handleRejectUser = async (userId) => {
    try {
      await axios.post(`/api/admin/users/${userId}/reject`)
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, manuallyApproved: false, rejected: true } 
          : user
      ))
      
      showInfo(
        'User Rejected', 
        'The user has been rejected.'
      )
      
      // Log audit event
      AuditService.logAdminEvent(
        'User Rejected',
        `Admin rejected user with ID: ${userId}`,
        'info',
        { userId }
      )
    } catch (error) {
      console.error('Error rejecting user:', error)
      showError(
        'Error Rejecting User', 
        'Could not reject user. Please try again.'
      )
      
      // Log error event
      AuditService.logErrorEvent(
        'User Rejection Failed',
        `Failed to reject user with ID: ${userId}`,
        'medium',
        { userId, error: error.message }
      )
    }
  }
  
  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    
    try {
      await axios.delete(`/api/admin/users/${userId}`)
      
      // Update local state
      setUsers(users.filter(user => user._id !== userId))
      
      // Clear selected user if it was deleted
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null)
      }
      
      showSuccess(
        'User Deleted', 
        'The user has been deleted successfully.'
      )
      
      // Log audit event
      AuditService.logAdminEvent(
        'User Deleted',
        `Admin deleted user with ID: ${userId}`,
        'medium',
        { userId }
      )
    } catch (error) {
      console.error('Error deleting user:', error)
      showError(
        'Error Deleting User', 
        'Could not delete user. Please try again.'
      )
      
      // Log error event
      AuditService.logErrorEvent(
        'User Deletion Failed',
        `Failed to delete user with ID: ${userId}`,
        'high',
        { userId, error: error.message }
      )
    }
  }
  
  // Handle user selection for detailed view
  const handleSelectUser = (user) => {
    setSelectedUser(user)
  }
  
  // Filter users based on current filter and search term
  const filteredUsers = users.filter(user => {
    // Apply status filter
    if (filter === 'pending' && user.manuallyApproved) return false
    if (filter === 'approved' && !user.manuallyApproved) return false
    if (filter === 'rejected' && !user.rejected) return false
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        user.email.toLowerCase().includes(searchLower) ||
        (user.name && user.name.toLowerCase().includes(searchLower))
      )
    }
    
    return true
  })
  
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
    <SacredCard title="User Management" symbol="unity">
      <div className="space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'all'
                  ? 'bg-sacred-100 text-sacred-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'approved'
                  ? 'bg-earth-100 text-earth-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-md border border-sacred-200 focus:outline-none focus:ring-2 focus:ring-sacred-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sacred-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* User List */}
        <div className="bg-white rounded-md shadow overflow-hidden">
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
              className="divide-y divide-sacred-100"
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sacred-900 font-medium">{user.name || user.email}</h3>
                      {user.name && <p className="text-sacred-600 text-sm">{user.email}</p>}
                      <div className="flex items-center mt-1 space-x-2">
                        {user.manuallyApproved ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-earth-100 text-earth-800">
                            Approved
                          </span>
                        ) : user.rejected ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                        
                        {user.lunaApproved && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cosmic-100 text-cosmic-800">
                            Luna Approved
                          </span>
                        )}
                        
                        {user.kofiSubscribed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Ko-fi Subscribed
                          </span>
                        )}
                        
                        {user.isAdmin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sacred-100 text-sacred-800">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!user.manuallyApproved && !user.rejected && (
                        <SacredButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApproveUser(user._id)
                          }}
                          variant="earth"
                          size="small"
                        >
                          Approve
                        </SacredButton>
                      )}
                      
                      {!user.rejected && (
                        <SacredButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRejectUser(user._id)
                          }}
                          variant="cosmic"
                          size="small"
                        >
                          Reject
                        </SacredButton>
                      )}
                      
                      <SacredButton
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteUser(user._id)
                        }}
                        variant="danger"
                        size="small"
                      >
                        Delete
                      </SacredButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Selected User Details */}
        {selectedUser && (
          <div className="bg-sacred-50 rounded-md p-6 border border-sacred-200">
            <h3 className="text-xl font-display text-sacred-900 mb-4">User Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sacred-600 text-sm">Email</p>
                <p className="text-sacred-900">{selectedUser.email}</p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">Name</p>
                <p className="text-sacred-900">{selectedUser.name || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">Joined</p>
                <p className="text-sacred-900">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">Last Login</p>
                <p className="text-sacred-900">
                  {selectedUser.lastLogin 
                    ? new Date(selectedUser.lastLogin).toLocaleDateString() 
                    : 'Never'}
                </p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">Credits Remaining</p>
                <p className="text-sacred-900">{selectedUser.credits || 0}</p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">Verification Status</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    selectedUser.manuallyApproved 
                      ? 'bg-earth-100 text-earth-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Manual: {selectedUser.manuallyApproved ? 'Approved' : 'Pending'}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    selectedUser.lunaApproved 
                      ? 'bg-cosmic-100 text-cosmic-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Luna: {selectedUser.lunaApproved ? 'Approved' : 'Pending'}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    selectedUser.kofiSubscribed 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Ko-fi: {selectedUser.kofiSubscribed ? 'Subscribed' : 'Not Subscribed'}
                  </span>
                </div>
              </div>
            </div>
            
            {selectedUser.accessRequestReason && (
              <div className="mt-4">
                <p className="text-sacred-600 text-sm">Access Request Reason</p>
                <p className="text-sacred-900 p-3 bg-white rounded-md border border-sacred-100 mt-1">
                  {selectedUser.accessRequestReason}
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              {!selectedUser.manuallyApproved && !selectedUser.rejected && (
                <SacredButton
                  onClick={() => handleApproveUser(selectedUser._id)}
                  variant="earth"
                >
                  Approve User
                </SacredButton>
              )}
              
              {!selectedUser.rejected && (
                <SacredButton
                  onClick={() => handleRejectUser(selectedUser._id)}
                  variant="cosmic"
                >
                  Reject User
                </SacredButton>
              )}
              
              <SacredButton
                onClick={() => handleDeleteUser(selectedUser._id)}
                variant="danger"
              >
                Delete User
              </SacredButton>
            </div>
          </div>
        )}
      </div>
    </SacredCard>
  )
}

export default AdminUserManagement
