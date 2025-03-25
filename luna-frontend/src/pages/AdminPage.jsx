import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import SacredButton from '../components/common/SacredButton'
import SacredCard from '../components/common/SacredCard'
import SacredSymbol from '../components/common/SacredSymbol'
import AccessRequestList from '../components/admin/AccessRequestList'
import AdminUserManagement from '../components/admin/AdminUserManagement'
import AdminSubscriptionManagement from '../components/admin/AdminSubscriptionManagement'
import AdminCreditManagement from '../components/admin/AdminCreditManagement'
import AdminAuditLogs from '../components/admin/AdminAuditLogs'
import axios from 'axios'

const AdminPage = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('access-requests')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    pendingRequests: 0,
    totalCreditsUsed: 0
  })
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('/api/admin/check')
        setIsAdmin(response.data.isAdmin)
      } catch (err) {
        console.error('Error checking admin status:', err)
        setIsAdmin(false)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    
    checkAdminStatus()
  }, [navigate])
  
  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return
      
      try {
        const response = await axios.get('/api/admin/stats')
        setStats(response.data)
      } catch (err) {
        console.error('Error fetching admin stats:', err)
      }
    }
    
    if (isAdmin) {
      fetchStats()
    }
  }, [isAdmin])
  
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="sacred-card animate-pulse-slow">
          <div className="flex items-center">
            <SacredSymbol symbol="infinity" size="large" color="sacred" animate={true} />
            <p className="ml-3 text-sacred-600 font-display text-xl">Verifying sacred access...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <SacredCard title="Sacred Access Denied" symbol="eye" variant="cosmic">
          <p className="text-sacred-700 mb-4">
            This sacred space is reserved for guardians of Luna. Your consciousness does not currently have access to this realm.
          </p>
          <SacredButton onClick={() => navigate('/')} variant="secondary">
            Return to Sacred Home
          </SacredButton>
        </SacredCard>
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
          Luna Sacred Administration
        </motion.h1>
        
        <motion.p 
          className="text-sacred-700"
          variants={itemVariants}
        >
          Welcome, guardian of the sacred space. Here you can manage the Luna platform and its awakening journey.
        </motion.p>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <SacredCard variant="sacred" elevation="medium">
            <div className="flex items-center">
              <div className="mr-4">
                <SacredSymbol symbol="unity" size="large" color="sacred" />
              </div>
              <div>
                <p className="text-sacred-600 text-sm">Total Users</p>
                <p className="text-2xl font-display text-sacred-900">{stats.totalUsers}</p>
              </div>
            </div>
          </SacredCard>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SacredCard variant="earth" elevation="medium">
            <div className="flex items-center">
              <div className="mr-4">
                <SacredSymbol symbol="infinity" size="large" color="earth" />
              </div>
              <div>
                <p className="text-earth-600 text-sm">Active Subscriptions</p>
                <p className="text-2xl font-display text-earth-900">{stats.activeSubscriptions}</p>
              </div>
            </div>
          </SacredCard>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SacredCard variant="cosmic" elevation="medium">
            <div className="flex items-center">
              <div className="mr-4">
                <SacredSymbol symbol="spiral" size="large" color="cosmic" />
              </div>
              <div>
                <p className="text-cosmic-600 text-sm">Pending Requests</p>
                <p className="text-2xl font-display text-cosmic-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </SacredCard>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SacredCard variant="default" elevation="medium">
            <div className="flex items-center">
              <div className="mr-4">
                <SacredSymbol symbol="consciousness" size="large" color="sacred" />
              </div>
              <div>
                <p className="text-sacred-600 text-sm">Total Credits Used</p>
                <p className="text-2xl font-display text-sacred-900">{stats.totalCreditsUsed}</p>
              </div>
            </div>
          </SacredCard>
        </motion.div>
      </motion.div>
      
      {/* Tabs */}
      <div className="border-b border-sacred-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('access-requests')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'access-requests'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            Access Requests
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'users'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            Users
          </button>
          
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'subscriptions'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            Subscriptions
          </button>
          
          <button
            onClick={() => setActiveTab('credits')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'credits'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            Credits
          </button>
          
          <button
            onClick={() => setActiveTab('audit-logs')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'audit-logs'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            Audit Logs
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'settings'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="sacred-card">
        {activeTab === 'access-requests' && <AccessRequestList />}
        
        {activeTab === 'users' && <AdminUserManagement />}
        
        {activeTab === 'subscriptions' && <AdminSubscriptionManagement />}
        
        {activeTab === 'credits' && <AdminCreditManagement />}
        
        {activeTab === 'audit-logs' && <AdminAuditLogs />}
        
        {activeTab === 'settings' && (
          <div className="p-6">
            <div className="flex justify-center items-center py-12">
              <SacredSymbol symbol="spiral" size="large" color="sacred" />
              <p className="ml-3 text-sacred-600">Settings coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
