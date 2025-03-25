import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import AuthTest from '../components/testing/AuthTest'

/**
 * TestingPage - A page for testing various components and functionality
 * 
 * This page is only available in development mode and provides a way to test
 * different components and features of the Luna platform.
 */
const TestingPage = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('auth')
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'
  
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
        duration: 0.5,
      },
    },
  }
  
  if (!isDevelopment) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="sacred-card">
          <p className="text-sacred-700 mb-4">
            The testing page is only available in development mode.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.h1 
          className="text-3xl font-display text-sacred-900 mb-2"
          variants={itemVariants}
        >
          Testing Environment
        </motion.h1>
        
        <motion.p 
          className="text-sacred-700"
          variants={itemVariants}
        >
          This page is only available in development mode and is used for testing various components and functionality.
        </motion.p>
      </motion.div>
      
      {/* Tabs */}
      <div className="border-b border-sacred-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('auth')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'auth'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            Authentication Tests
          </button>
          
          <button
            onClick={() => setActiveTab('ui')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'ui'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            UI Components
          </button>
          
          <button
            onClick={() => setActiveTab('api')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'api'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            API Tests
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'auth' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AuthTest />
          </motion.div>
        )}
        
        {activeTab === 'ui' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sacred-card"
          >
            <h2 className="text-xl font-display text-sacred-900 mb-4">UI Component Tests</h2>
            <p className="text-sacred-700 mb-4">
              This section will contain tests for various UI components.
            </p>
            
            <div className="p-4 bg-sacred-50 rounded-md">
              <p className="text-sacred-600">No UI tests implemented yet.</p>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'api' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sacred-card"
          >
            <h2 className="text-xl font-display text-sacred-900 mb-4">API Tests</h2>
            <p className="text-sacred-700 mb-4">
              This section will contain tests for various API endpoints.
            </p>
            
            <div className="p-4 bg-sacred-50 rounded-md">
              <p className="text-sacred-600">No API tests implemented yet.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TestingPage
