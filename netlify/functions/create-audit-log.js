const { MongoClient } = require('mongodb')
require('dotenv').config()

// MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME || 'luna'

/**
 * Netlify Function to create security audit logs
 * 
 * This function connects to MongoDB and creates new audit log entries
 * for security-related events in the Luna platform.
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
  
  // Parse request body
  let requestBody
  try {
    requestBody = JSON.parse(event.body)
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
  
  // Validate required fields
  const { event: eventName, description, eventType, severity } = requestBody
  
  if (!eventName || !description || !eventType) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
  
  // Validate event type
  const validEventTypes = ['auth', 'user', 'admin', 'subscription', 'error', 'system']
  if (!validEventTypes.includes(eventType)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid event type' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
  
  // Validate severity
  const validSeverities = ['high', 'medium', 'low', 'info']
  if (severity && !validSeverities.includes(severity)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid severity' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
  
  // Verify authentication for certain event types
  const authHeader = event.headers.authorization
  const requiresAuth = ['admin', 'user', 'subscription']
  
  if (requiresAuth.includes(eventType)) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
    
    // Extract token from header
    const token = authHeader.split(' ')[1]
    
    // Connect to MongoDB to verify token
    let tempClient
    try {
      tempClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      await tempClient.connect()
      
      const db = tempClient.db(dbName)
      
      // Verify token is valid
      const usersCollection = db.collection('users')
      const user = await usersCollection.findOne({
        'sessions.token': token,
        'sessions.expiresAt': { $gt: new Date() }
      })
      
      if (!user) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      }
      
      // For admin events, verify user is an admin
      if (eventType === 'admin' && user.role !== 'admin') {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Forbidden' }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      }
      
      // Add user ID to request body
      requestBody.userId = user._id.toString()
    } catch (error) {
      console.error('Error verifying authentication:', error)
      
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    } finally {
      if (tempClient) {
        await tempClient.close()
      }
    }
  }
  
  // Connect to MongoDB
  let client
  try {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    await client.connect()
    
    const db = client.db(dbName)
    const auditLogsCollection = db.collection('auditLogs')
    
    // Create audit log entry
    const auditLog = {
      event: eventName,
      description,
      eventType,
      severity: severity || 'info',
      timestamp: new Date(),
      ipAddress: event.headers['client-ip'] || event.headers['x-forwarded-for'],
      userAgent: event.headers['user-agent'],
      ...requestBody
    }
    
    // Remove any sensitive data
    delete auditLog.password
    delete auditLog.token
    
    // Insert audit log
    const result = await auditLogsCollection.insertOne(auditLog)
    
    return {
      statusCode: 201,
      body: JSON.stringify({ 
        success: true, 
        id: result.insertedId 
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (error) {
    console.error('Error creating audit log:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}
