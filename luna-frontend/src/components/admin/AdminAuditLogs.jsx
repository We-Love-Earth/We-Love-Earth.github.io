import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SacredCard from '../common/SacredCard'
import SacredButton from '../common/SacredButton'
import SacredSymbol from '../common/SacredSymbol'
import { useNotification } from '../../contexts/NotificationContext'
import AuditService from '../../services/AuditService'

/**
 * AdminAuditLogs - Component for viewing security audit logs
 * 
 * This component displays security-related events in the system,
 * helping administrators monitor and investigate security incidents.
 * It's designed to work with Netlify Functions for backend processing.
 */
const AdminAuditLogs = () => {
  const { t } = useTranslation()
  const { showError } = useNotification()
  
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedLog, setSelectedLog] = useState(null)
  
  const logsPerPage = 20
  
  // Fetch audit logs on component mount and when filter/page changes
  useEffect(() => {
    fetchAuditLogs()
  }, [filter, page])
  
  // Fetch audit logs from API
  const fetchAuditLogs = async () => {
    setLoading(true)
    try {
      const response = await AuditService.getAuditLogs(
        page,
        logsPerPage,
        filter !== 'all' ? filter : null,
        searchTerm || null
      )
      
      setAuditLogs(response.logs)
      setTotalPages(response.totalPages)
      
      // Log audit event for viewing logs
      AuditService.logAdminEvent(
        'Audit Logs Viewed',
        `Admin viewed audit logs with filter: ${filter}`,
        'info',
        { filter, page, searchTerm }
      )
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      showError(
        'Error Loading Audit Logs', 
        'Could not load audit logs. Please try again later.'
      )
      
      // Log error event
      AuditService.logErrorEvent(
        'Audit Logs Fetch Failed',
        'Failed to retrieve audit logs',
        'medium',
        { error: error.message }
      )
    } finally {
      setLoading(false)
    }
  }
  
  // Handle search
  const handleSearch = () => {
    setPage(1) // Reset to first page when searching
    fetchAuditLogs()
  }
  
  // Handle log selection for detailed view
  const handleSelectLog = (log) => {
    setSelectedLog(log)
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }
  
  // Get appropriate icon and color for event type
  const getEventTypeInfo = (eventType) => {
    switch (eventType) {
      case 'auth':
        return { icon: 'key', color: 'cosmic' }
      case 'user':
        return { icon: 'user', color: 'sacred' }
      case 'admin':
        return { icon: 'shield', color: 'earth' }
      case 'subscription':
        return { icon: 'star', color: 'amber' }
      case 'error':
        return { icon: 'alert', color: 'red' }
      default:
        return { icon: 'info', color: 'gray' }
    }
  }
  
  // Get severity level display
  const getSeverityDisplay = (severity) => {
    switch (severity) {
      case 'high':
        return { text: 'High', bgColor: 'bg-red-100', textColor: 'text-red-800' }
      case 'medium':
        return { text: 'Medium', bgColor: 'bg-amber-100', textColor: 'text-amber-800' }
      case 'low':
        return { text: 'Low', bgColor: 'bg-earth-100', textColor: 'text-earth-800' }
      case 'info':
        return { text: 'Info', bgColor: 'bg-cosmic-100', textColor: 'text-cosmic-800' }
      default:
        return { text: 'Info', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
    }
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
    <SacredCard title="Security Audit Logs" symbol="shield">
      <div className="space-y-6">
        {/* Info Panel */}
        <div className="bg-sacred-50 border border-sacred-200 p-4 rounded-md">
          <h3 className="text-sacred-900 font-medium mb-2">Security Audit System</h3>
          <p className="text-sacred-700 text-sm">
            The audit log system records security-related events across Luna, helping to monitor and investigate security incidents.
            Events are categorized by type and severity for easier filtering.
          </p>
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
              All Events
            </button>
            <button
              onClick={() => setFilter('auth')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'auth'
                  ? 'bg-cosmic-100 text-cosmic-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Authentication
            </button>
            <button
              onClick={() => setFilter('user')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'user'
                  ? 'bg-sacred-100 text-sacred-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              User Events
            </button>
            <button
              onClick={() => setFilter('admin')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'admin'
                  ? 'bg-earth-100 text-earth-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Admin Actions
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Errors
            </button>
          </div>
          
          <div className="flex">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full md:w-64 px-4 py-2 rounded-l-md border border-sacred-200 focus:outline-none focus:ring-2 focus:ring-sacred-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-sacred-600 text-white rounded-r-md hover:bg-sacred-700 focus:outline-none focus:ring-2 focus:ring-sacred-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Audit Log List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-md shadow overflow-hidden">
              <div className="p-3 bg-sacred-50 border-b border-sacred-100 flex justify-between items-center">
                <h3 className="text-sacred-900 font-medium">Audit Events</h3>
                
                {/* Pagination */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`p-1 rounded ${
                      page === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-sacred-600 hover:bg-sacred-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <span className="text-sm text-sacred-600">
                    Page {page} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`p-1 rounded ${
                      page === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-sacred-600 hover:bg-sacred-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <SacredSymbol symbol="infinity" size="medium" color="sacred" animate={true} />
                  <span className="ml-3 text-sacred-600">Loading audit logs...</span>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sacred-600">No audit logs found matching your criteria.</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-sacred-100 max-h-[600px] overflow-y-auto"
                >
                  {auditLogs.map(log => {
                    const eventInfo = getEventTypeInfo(log.eventType)
                    const severityInfo = getSeverityDisplay(log.severity)
                    
                    return (
                      <motion.div
                        key={log._id}
                        variants={itemVariants}
                        className={`p-4 hover:bg-sacred-50 cursor-pointer ${
                          selectedLog && selectedLog._id === log._id ? 'bg-sacred-50' : ''
                        }`}
                        onClick={() => handleSelectLog(log)}
                      >
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 mr-3 mt-1 w-8 h-8 rounded-full flex items-center justify-center bg-${eventInfo.color}-100`}>
                            <SacredSymbol symbol={eventInfo.icon} size="small" color={eventInfo.color} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-sacred-900 font-medium">{log.event}</h4>
                              <span className="text-sacred-500 text-sm">{formatDate(log.timestamp)}</span>
                            </div>
                            
                            <p className="text-sacred-600 text-sm mt-1 line-clamp-2">{log.description}</p>
                            
                            <div className="flex items-center mt-2 space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${severityInfo.bgColor} ${severityInfo.textColor}`}>
                                {severityInfo.text}
                              </span>
                              
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${eventInfo.color}-100 text-${eventInfo.color}-800`}>
                                {log.eventType}
                              </span>
                              
                              {log.userId && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  User: {log.userId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Selected Log Details */}
          <div className="md:col-span-1">
            {selectedLog ? (
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="p-3 bg-sacred-50 border-b border-sacred-100">
                  <h3 className="text-sacred-900 font-medium">Event Details</h3>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-sacred-500">Event</h4>
                    <p className="text-sacred-900">{selectedLog.event}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-sacred-500">Timestamp</h4>
                    <p className="text-sacred-900">{formatDate(selectedLog.timestamp)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-sacred-500">Description</h4>
                    <p className="text-sacred-900">{selectedLog.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-sacred-500">Event Type</h4>
                    <p className="text-sacred-900">{selectedLog.eventType}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-sacred-500">Severity</h4>
                    <p className="text-sacred-900">{selectedLog.severity}</p>
                  </div>
                  
                  {selectedLog.userId && (
                    <div>
                      <h4 className="text-sm font-medium text-sacred-500">User ID</h4>
                      <p className="text-sacred-900">{selectedLog.userId}</p>
                    </div>
                  )}
                  
                  {selectedLog.ipAddress && (
                    <div>
                      <h4 className="text-sm font-medium text-sacred-500">IP Address</h4>
                      <p className="text-sacred-900">{selectedLog.ipAddress}</p>
                    </div>
                  )}
                  
                  {selectedLog.userAgent && (
                    <div>
                      <h4 className="text-sm font-medium text-sacred-500">User Agent</h4>
                      <p className="text-sacred-900 text-sm break-words">{selectedLog.userAgent}</p>
                    </div>
                  )}
                  
                  {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-sacred-500">Additional Data</h4>
                      <pre className="mt-1 p-2 bg-gray-50 rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-md shadow p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <SacredSymbol symbol="shield" size="large" color="sacred" />
                  <p className="mt-4 text-sacred-600">Select an event to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SacredCard>
  )
}

export default AdminAuditLogs
