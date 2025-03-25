import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SacredButton from '../common/SacredButton'
import SacredCard from '../common/SacredCard'
import SacredSymbol from '../common/SacredSymbol'
import axios from 'axios'

const AccessRequestList = () => {
  const { t } = useTranslation()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedRequest, setExpandedRequest] = useState(null)
  
  // Fetch access requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/admin/access-requests')
        setRequests(response.data)
      } catch (err) {
        console.error('Error fetching access requests:', err)
        setError('Failed to load access requests')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRequests()
  }, [])
  
  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/access-requests/${id}/approve`)
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === id ? { ...req, status: 'approved' } : req
        )
      )
    } catch (err) {
      console.error('Error approving request:', err)
      setError('Failed to approve request')
    }
  }
  
  const handleReject = async (id) => {
    try {
      await axios.post(`/api/admin/access-requests/${id}/reject`)
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === id ? { ...req, status: 'rejected' } : req
        )
      )
    } catch (err) {
      console.error('Error rejecting request:', err)
      setError('Failed to reject request')
    }
  }
  
  const toggleExpand = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id)
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center">
          <SacredSymbol symbol="infinity" size="large" color="sacred" animate={true} />
          <span className="ml-3 text-sacred-600">Loading requests...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-display text-sacred-900 mb-6">
          Access Requests
        </h2>
        
        {requests.length === 0 ? (
          <SacredCard title="No Requests" symbol="infinity">
            <p className="text-sacred-700">
              There are currently no pending access requests.
            </p>
          </SacredCard>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <motion.div
                key={request._id}
                variants={itemVariants}
              >
                <SacredCard 
                  variant={
                    request.status === 'approved' 
                      ? 'earth' 
                      : request.status === 'rejected'
                      ? 'cosmic'
                      : 'sacred'
                  }
                  elevation="medium"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-display text-sacred-900">
                        {request.name}
                      </h3>
                      <p className="text-sacred-700">{request.email}</p>
                      <div className="mt-2">
                        <span 
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            request.status === 'pending'
                              ? 'bg-sacred-100 text-sacred-800'
                              : request.status === 'approved'
                              ? 'bg-earth-100 text-earth-800'
                              : 'bg-cosmic-100 text-cosmic-800'
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        
                        <span className="text-xs text-sacred-500 ml-2">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <SacredButton
                            onClick={() => handleApprove(request._id)}
                            variant="earth"
                            size="small"
                          >
                            Approve
                          </SacredButton>
                          
                          <SacredButton
                            onClick={() => handleReject(request._id)}
                            variant="cosmic"
                            size="small"
                          >
                            Reject
                          </SacredButton>
                        </>
                      )}
                      
                      <SacredButton
                        onClick={() => toggleExpand(request._id)}
                        variant="secondary"
                        size="small"
                      >
                        {expandedRequest === request._id ? 'Hide' : 'View'}
                      </SacredButton>
                    </div>
                  </div>
                  
                  {expandedRequest === request._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-sacred-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sacred-800 mb-1">Intention</h4>
                          <p className="text-sacred-700 whitespace-pre-wrap">{request.intention}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sacred-800 mb-1">Purpose</h4>
                          <p className="text-sacred-700 whitespace-pre-wrap">{request.purpose}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sacred-800 mb-1">Connection to Earth</h4>
                          <p className="text-sacred-700 whitespace-pre-wrap">{request.connection}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sacred-800 mb-1">Astrorganism Understanding</h4>
                          <p className="text-sacred-700 whitespace-pre-wrap">{request.astrorganism}</p>
                        </div>
                      </div>
                      
                      {request.accessCode && (
                        <div className="mt-4 pt-4 border-t border-sacred-200">
                          <h4 className="font-medium text-sacred-800 mb-1">Access Code</h4>
                          <p className="text-sacred-700">{request.accessCode}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </SacredCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AccessRequestList
