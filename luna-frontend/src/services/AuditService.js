import axios from 'axios'

/**
 * AuditService - Service for logging security audit events
 * 
 * This service provides methods for logging different types of security events
 * in the Luna platform, helping to maintain a comprehensive audit trail.
 * It integrates with Netlify Functions for serverless operation.
 */
class AuditService {
  /**
   * Log an authentication event
   * @param {string} event - Event name
   * @param {string} description - Detailed description
   * @param {string} severity - Event severity (high, medium, low, info)
   * @param {object} metadata - Additional event data
   */
  static async logAuthEvent(event, description, severity = 'info', metadata = {}) {
    return this.logEvent(event, description, 'auth', severity, metadata)
  }
  
  /**
   * Log a user-related event
   * @param {string} event - Event name
   * @param {string} description - Detailed description
   * @param {string} severity - Event severity (high, medium, low, info)
   * @param {object} metadata - Additional event data
   */
  static async logUserEvent(event, description, severity = 'info', metadata = {}) {
    return this.logEvent(event, description, 'user', severity, metadata)
  }
  
  /**
   * Log an admin action
   * @param {string} event - Event name
   * @param {string} description - Detailed description
   * @param {string} severity - Event severity (high, medium, low, info)
   * @param {object} metadata - Additional event data
   */
  static async logAdminEvent(event, description, severity = 'info', metadata = {}) {
    return this.logEvent(event, description, 'admin', severity, metadata)
  }
  
  /**
   * Log a subscription-related event
   * @param {string} event - Event name
   * @param {string} description - Detailed description
   * @param {string} severity - Event severity (high, medium, low, info)
   * @param {object} metadata - Additional event data
   */
  static async logSubscriptionEvent(event, description, severity = 'info', metadata = {}) {
    return this.logEvent(event, description, 'subscription', severity, metadata)
  }
  
  /**
   * Log an error event
   * @param {string} event - Event name
   * @param {string} description - Detailed description
   * @param {string} severity - Event severity (high, medium, low, info)
   * @param {object} metadata - Additional event data
   */
  static async logErrorEvent(event, description, severity = 'medium', metadata = {}) {
    return this.logEvent(event, description, 'error', severity, metadata)
  }
  
  /**
   * Log a system event
   * @param {string} event - Event name
   * @param {string} description - Detailed description
   * @param {string} severity - Event severity (high, medium, low, info)
   * @param {object} metadata - Additional event data
   */
  static async logSystemEvent(event, description, severity = 'info', metadata = {}) {
    return this.logEvent(event, description, 'system', severity, metadata)
  }
  
  /**
   * Generic method to log any type of event
   * @param {string} event - Event name
   * @param {string} description - Detailed description
   * @param {string} eventType - Event type (auth, user, admin, subscription, error, system)
   * @param {string} severity - Event severity (high, medium, low, info)
   * @param {object} metadata - Additional event data
   */
  static async logEvent(event, description, eventType, severity = 'info', metadata = {}) {
    try {
      const response = await axios.post('/.netlify/functions/create-audit-log', {
        event,
        description,
        eventType,
        severity,
        metadata
      })
      
      return response.data
    } catch (error) {
      console.error('Error logging audit event:', error)
      
      // If we can't log to the server, at least log to console
      console.warn('Audit event not recorded:', {
        event,
        description,
        eventType,
        severity,
        metadata,
        timestamp: new Date().toISOString()
      })
      
      return { error: true, message: error.message }
    }
  }
  
  /**
   * Get audit logs with filtering and pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} eventType - Filter by event type
   * @param {string} search - Search term
   */
  static async getAuditLogs(page = 1, limit = 20, eventType = null, search = null) {
    try {
      const params = { page, limit }
      
      if (eventType) {
        params.eventType = eventType
      }
      
      if (search) {
        params.search = search
      }
      
      const response = await axios.get('/.netlify/functions/get-audit-logs', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      throw error
    }
  }
}

export default AuditService
