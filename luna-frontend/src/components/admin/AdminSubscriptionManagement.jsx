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
 * AdminSubscriptionManagement - Component for managing Ko-fi subscriptions
 * 
 * This component allows administrators to view and manage Ko-fi subscriptions,
 * which are part of the triple verification process for Luna access.
 */
const AdminSubscriptionManagement = () => {
  const { t } = useTranslation()
  const { showSuccess, showError, showInfo } = useNotification()
  
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [webhookStatus, setWebhookStatus] = useState('unknown')
  
  // Fetch subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions()
    checkWebhookStatus()
  }, [])
  
  // Fetch subscriptions from API
  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/subscriptions')
      setSubscriptions(response.data)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      showError(
        'Error Loading Subscriptions', 
        'Could not load subscriptions. Please try again later.'
      )
    } finally {
      setLoading(false)
    }
  }
  
  // Check webhook status
  const checkWebhookStatus = async () => {
    try {
      const response = await axios.get('/api/admin/webhook-status')
      setWebhookStatus(response.data.status)
    } catch (error) {
      console.error('Error checking webhook status:', error)
      setWebhookStatus('error')
    }
  }
  
  // Handle manual subscription verification
  const handleVerifySubscription = async (subscriptionId) => {
    try {
      await axios.post(`/api/admin/subscriptions/${subscriptionId}/verify`)
      
      // Update local state
      setSubscriptions(subscriptions.map(sub => 
        sub._id === subscriptionId 
          ? { ...sub, verified: true } 
          : sub
      ))
      
      showSuccess(
        'Subscription Verified', 
        'The subscription has been verified successfully.'
      )
      
      // Log audit event
      AuditService.logAdminEvent(
        'Subscription Verified',
        `Admin verified subscription with ID: ${subscriptionId}`,
        'info',
        { subscriptionId }
      )
    } catch (error) {
      console.error('Error verifying subscription:', error)
      showError(
        'Error Verifying Subscription', 
        'Could not verify subscription. Please try again.'
      )
      
      // Log error event
      AuditService.logErrorEvent(
        'Subscription Verification Failed',
        `Failed to verify subscription with ID: ${subscriptionId}`,
        'medium',
        { subscriptionId, error: error.message }
      )
    }
  }
  
  // Handle subscription deletion
  const handleDeleteSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to delete this subscription? This action cannot be undone.')) {
      return
    }
    
    try {
      await axios.delete(`/api/admin/subscriptions/${subscriptionId}`)
      
      // Update local state
      setSubscriptions(subscriptions.filter(sub => sub._id !== subscriptionId))
      
      // Clear selected subscription if it was deleted
      if (selectedSubscription && selectedSubscription._id === subscriptionId) {
        setSelectedSubscription(null)
      }
      
      showSuccess(
        'Subscription Deleted', 
        'The subscription has been deleted successfully.'
      )
      
      // Log audit event
      AuditService.logAdminEvent(
        'Subscription Deleted',
        `Admin deleted subscription with ID: ${subscriptionId}`,
        'medium',
        { subscriptionId }
      )
    } catch (error) {
      console.error('Error deleting subscription:', error)
      showError(
        'Error Deleting Subscription', 
        'Could not delete subscription. Please try again.'
      )
      
      // Log error event
      AuditService.logErrorEvent(
        'Subscription Deletion Failed',
        `Failed to delete subscription with ID: ${subscriptionId}`,
        'high',
        { subscriptionId, error: error.message }
      )
    }
  }
  
  // Handle subscription selection for detailed view
  const handleSelectSubscription = (subscription) => {
    setSelectedSubscription(subscription)
  }
  
  // Filter subscriptions based on current filter and search term
  const filteredSubscriptions = subscriptions.filter(sub => {
    // Apply status filter
    if (filter === 'active' && !sub.active) return false
    if (filter === 'expired' && sub.active) return false
    if (filter === 'unverified' && sub.verified) return false
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        (sub.email && sub.email.toLowerCase().includes(searchLower)) ||
        (sub.kofiTransactionId && sub.kofiTransactionId.toLowerCase().includes(searchLower)) ||
        (sub.userName && sub.userName.toLowerCase().includes(searchLower))
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
    <SacredCard title="Ko-fi Subscription Management" symbol="infinity">
      <div className="space-y-6">
        {/* Webhook Status */}
        <div className={`p-4 rounded-md ${
          webhookStatus === 'active' 
            ? 'bg-earth-50 border border-earth-200' 
            : webhookStatus === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {webhookStatus === 'active' ? (
                <svg className="h-5 w-5 text-earth-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                webhookStatus === 'active' 
                  ? 'text-earth-800' 
                  : webhookStatus === 'error'
                    ? 'text-red-800'
                    : 'text-amber-800'
              }`}>
                Ko-fi Webhook Status: {
                  webhookStatus === 'active' 
                    ? 'Active' 
                    : webhookStatus === 'error'
                      ? 'Error'
                      : 'Unknown'
                }
              </h3>
              <div className={`mt-2 text-sm ${
                webhookStatus === 'active' 
                  ? 'text-earth-700' 
                  : webhookStatus === 'error'
                    ? 'text-red-700'
                    : 'text-amber-700'
              }`}>
                <p>
                  {webhookStatus === 'active' 
                    ? 'The Ko-fi webhook is properly configured and receiving subscription events.' 
                    : webhookStatus === 'error'
                      ? 'There is an issue with the Ko-fi webhook. Please check the configuration.'
                      : 'The Ko-fi webhook status is unknown. Please check the configuration.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
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
              All Subscriptions
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'active'
                  ? 'bg-earth-100 text-earth-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'expired'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Expired
            </button>
            <button
              onClick={() => setFilter('unverified')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'unverified'
                  ? 'bg-cosmic-100 text-cosmic-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unverified
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search subscriptions..."
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
        
        {/* Subscription List */}
        <div className="bg-white rounded-md shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <SacredSymbol symbol="infinity" size="medium" color="sacred" animate={true} />
              <span className="ml-3 text-sacred-600">Loading subscriptions...</span>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sacred-600">No subscriptions found matching your criteria.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-sacred-100"
            >
              {filteredSubscriptions.map(subscription => (
                <motion.div
                  key={subscription._id}
                  variants={itemVariants}
                  className={`p-4 hover:bg-sacred-50 cursor-pointer ${
                    selectedSubscription && selectedSubscription._id === subscription._id ? 'bg-sacred-50' : ''
                  }`}
                  onClick={() => handleSelectSubscription(subscription)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sacred-900 font-medium">{subscription.userName || subscription.email || 'Unknown User'}</h3>
                      {subscription.email && <p className="text-sacred-600 text-sm">{subscription.email}</p>}
                      <div className="flex items-center mt-1 space-x-2">
                        {subscription.active ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-earth-100 text-earth-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            Expired
                          </span>
                        )}
                        
                        {subscription.verified ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cosmic-100 text-cosmic-800">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!subscription.verified && (
                        <SacredButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVerifySubscription(subscription._id)
                          }}
                          variant="earth"
                          size="small"
                        >
                          Verify
                        </SacredButton>
                      )}
                      
                      <SacredButton
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSubscription(subscription._id)
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
        
        {/* Selected Subscription Details */}
        {selectedSubscription && (
          <div className="bg-sacred-50 rounded-md p-6 border border-sacred-200">
            <h3 className="text-xl font-display text-sacred-900 mb-4">Subscription Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sacred-600 text-sm">Ko-fi Transaction ID</p>
                <p className="text-sacred-900">{selectedSubscription.kofiTransactionId || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">User Email</p>
                <p className="text-sacred-900">{selectedSubscription.email || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">User Name</p>
                <p className="text-sacred-900">{selectedSubscription.userName || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">Amount</p>
                <p className="text-sacred-900">${selectedSubscription.amount || '0.00'}</p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">Subscription Date</p>
                <p className="text-sacred-900">
                  {selectedSubscription.createdAt 
                    ? new Date(selectedSubscription.createdAt).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">Expiry Date</p>
                <p className="text-sacred-900">
                  {selectedSubscription.expiryDate 
                    ? new Date(selectedSubscription.expiryDate).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sacred-600 text-sm">Status</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    selectedSubscription.active 
                      ? 'bg-earth-100 text-earth-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedSubscription.active ? 'Active' : 'Expired'}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    selectedSubscription.verified 
                      ? 'bg-cosmic-100 text-cosmic-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedSubscription.verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
            
            {selectedSubscription.message && (
              <div className="mt-4">
                <p className="text-sacred-600 text-sm">Message from Subscriber</p>
                <p className="text-sacred-900 p-3 bg-white rounded-md border border-sacred-100 mt-1">
                  {selectedSubscription.message}
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              {!selectedSubscription.verified && (
                <SacredButton
                  onClick={() => handleVerifySubscription(selectedSubscription._id)}
                  variant="earth"
                >
                  Verify Subscription
                </SacredButton>
              )}
              
              <SacredButton
                onClick={() => handleDeleteSubscription(selectedSubscription._id)}
                variant="danger"
              >
                Delete Subscription
              </SacredButton>
            </div>
          </div>
        )}
      </div>
    </SacredCard>
  )
}

export default AdminSubscriptionManagement
