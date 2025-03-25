const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

// MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME || 'luna'

/**
 * Netlify Function to retrieve security audit logs
 * 
 * This function connects to MongoDB and retrieves audit logs based on
 * provided filters. It supports pagination, filtering by event type,
 * and text search.
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    }
  }
  
  // Parse query parameters
  const queryParams = event.queryStringParameters || {}
  const page = parseInt(queryParams.page) || 1
  const limit = parseInt(queryParams.limit) || 20
  const eventType = queryParams.eventType
  const search = queryParams.search
  
  // Verify authentication
  const authHeader = event.headers.authorization
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
  
  // Connect to MongoDB
  let client
  try {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    await client.connect()
    
    const db = client.db(dbName)
    
    // Verify token is valid and belongs to an admin user
    const usersCollection = db.collection('users')
    const user = await usersCollection.findOne({
      'sessions.token': token,
      'sessions.expiresAt': { $gt: new Date() },
      role: 'admin'
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
    
    // Build query filter
    const filter = {}
    
    // Add event type filter if provided
    if (eventType) {
      filter.eventType = eventType
    }
    
    // Add text search if provided
    if (search) {
      filter.$or = [
        { event: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Get audit logs collection
    const auditLogsCollection = db.collection('auditLogs')
    
    // Count total documents for pagination
    const total = await auditLogsCollection.countDocuments(filter)
    
    // Get paginated results
    const logs = await auditLogsCollection
      .find(filter)
      .sort({ timestamp: -1 }) // Most recent first
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (error) {
    console.error('Error retrieving audit logs:', error)
    
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
