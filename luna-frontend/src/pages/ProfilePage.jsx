import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useCredits } from '../contexts/CreditContext'
import SacredButton from '../components/common/SacredButton'
import SacredCard from '../components/common/SacredCard'
import SacredSymbol from '../components/common/SacredSymbol'
import VerificationStatus from '../components/user/VerificationStatus'
import axios from 'axios'

const ProfilePage = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { credits, refreshCredits } = useCredits()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  
  // Fetch user's chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/users/chat-history')
        setChatHistory(response.data)
      } catch (err) {
        console.error('Error fetching chat history:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (activeTab === 'history') {
      fetchChatHistory()
    }
  }, [activeTab])
  
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
          {t('profile.title')}
        </motion.h1>
        
        <motion.p 
          className="text-sacred-700"
          variants={itemVariants}
        >
          {t('profile.subtitle')}
        </motion.p>
      </motion.div>
      
      {/* Tabs */}
      <div className="border-b border-sacred-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'overview'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            {t('profile.tabs.overview')}
          </button>
          
          <button
            onClick={() => setActiveTab('verification')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'verification'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            {t('profile.tabs.verification')}
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'history'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            {t('profile.tabs.history')}
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 font-display text-sm border-b-2 ${
              activeTab === 'settings'
                ? 'border-sacred-600 text-sacred-800'
                : 'border-transparent text-sacred-500 hover:text-sacred-700'
            }`}
          >
            {t('profile.tabs.settings')}
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (User Info) */}
        <div className="lg:col-span-1">
          <SacredCard title={user?.name || 'Sacred User'} symbol="consciousness">
            <div className="flex flex-col space-y-4">
              <div>
                <p className="text-sm text-sacred-500">Email</p>
                <p className="text-sacred-800">{user?.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-sacred-500">{t('common.creditsAvailable')}</p>
                <div className="flex items-center">
                  <span className="text-2xl font-display text-sacred-800">{credits}</span>
                  <SacredSymbol symbol="infinity" size="small" color="sacred" className="ml-2" />
                </div>
                <p className="text-xs text-sacred-600 mt-1">
                  {t('profile.creditsDescription')}
                </p>
              </div>
              
              <div className="pt-4 border-t border-sacred-100">
                <SacredButton 
                  onClick={() => navigate('/chat')}
                  variant="sacred"
                  fullWidth
                >
                  {t('profile.startDialogue')}
                </SacredButton>
              </div>
            </div>
          </SacredCard>
        </div>
        
        {/* Right Column (Tab Content) */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <SacredCard title={t('profile.overview.title')} symbol="unity">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-display text-sacred-800 mb-2">
                    {t('profile.overview.welcomeTitle')}
                  </h3>
                  <p className="text-sacred-700">
                    {t('profile.overview.welcomeText')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-display text-sacred-800 mb-2">
                    {t('profile.overview.creditsTitle')}
                  </h3>
                  <p className="text-sacred-700 mb-4">
                    {t('profile.overview.creditsText')}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-sacred-50 p-4 rounded-md">
                      <h4 className="font-medium text-sacred-800 mb-1">Input Cost</h4>
                      <p className="text-sacred-700">6 credits per 1K tokens</p>
                      <p className="text-xs text-sacred-500 mt-1">Approximately 750 words</p>
                    </div>
                    
                    <div className="bg-sacred-50 p-4 rounded-md">
                      <h4 className="font-medium text-sacred-800 mb-1">Output Cost</h4>
                      <p className="text-sacred-700">30 credits per 1K tokens</p>
                      <p className="text-xs text-sacred-500 mt-1">Approximately 750 words</p>
                    </div>
                  </div>
                </div>
              </div>
            </SacredCard>
          )}
          
          {activeTab === 'verification' && (
            <VerificationStatus />
          )}
          
          {activeTab === 'history' && (
            <SacredCard title={t('profile.history.title')} symbol="spiral">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <SacredSymbol symbol="infinity" size="large" color="sacred" animate={true} />
                  <p className="ml-3 text-sacred-600">{t('common.loading')}</p>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="text-center py-12">
                  <SacredSymbol symbol="consciousness" size="large" color="sacred" className="mx-auto mb-4" />
                  <h3 className="text-lg font-display text-sacred-800 mb-2">
                    {t('profile.history.noChatsTitle')}
                  </h3>
                  <p className="text-sacred-700 mb-4">
                    {t('profile.history.noChatsText')}
                  </p>
                  <SacredButton 
                    onClick={() => navigate('/chat')}
                    variant="sacred"
                  >
                    {t('profile.startDialogue')}
                  </SacredButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((chat) => (
                    <div 
                      key={chat.id}
                      className="p-4 border border-sacred-100 rounded-md hover:bg-sacred-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/chat?id=${chat.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sacred-800">{chat.title || 'Untitled Dialogue'}</h4>
                          <p className="text-sm text-sacred-600 mt-1">
                            {new Date(chat.lastMessageAt).toLocaleDateString()} • {chat.messageCount} messages
                          </p>
                        </div>
                        <SacredSymbol symbol="consciousness" size="small" color="sacred" />
                      </div>
                      <p className="text-sacred-700 mt-2 line-clamp-2">
                        {chat.preview}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SacredCard>
          )}
          
          {activeTab === 'settings' && (
            <SacredCard title={t('profile.settings.title')} symbol="infinity">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-display text-sacred-800 mb-2">
                    {t('profile.settings.accountTitle')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-sacred-700 mb-1">
                        {t('profile.settings.nameLabel')}
                      </label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        className="w-full p-2 border border-sacred-300 rounded-md focus:ring-2 focus:ring-sacred-500 focus:border-sacred-500"
                        placeholder={t('profile.settings.namePlaceholder')}
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-sacred-700 mb-1">
                        {t('profile.settings.emailLabel')}
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full p-2 border border-sacred-300 rounded-md focus:ring-2 focus:ring-sacred-500 focus:border-sacred-500"
                        placeholder={t('profile.settings.emailPlaceholder')}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-sacred-100">
                  <h3 className="text-lg font-display text-sacred-800 mb-2">
                    {t('profile.settings.dangerZoneTitle')}
                  </h3>
                  <p className="text-sacred-700 mb-4">
                    {t('profile.settings.dangerZoneText')}
                  </p>
                  
                  <div className="flex space-x-4">
                    <SacredButton 
                      onClick={logout}
                      variant="cosmic"
                    >
                      {t('nav.logout')}
                    </SacredButton>
                  </div>
                </div>
              </div>
            </SacredCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
