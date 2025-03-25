import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const { t } = useTranslation()
  const { requestLoginLink, verifyLoginToken, loading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [email, setEmail] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [showAccessCode, setShowAccessCode] = useState(false)
  
  // Check for token in URL (when user clicks the magic link)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const token = queryParams.get('token')
    
    if (token) {
      const verifyToken = async () => {
        const success = await verifyLoginToken(token)
        if (success) {
          navigate('/chat')
        }
      }
      
      verifyToken()
    }
  }, [location, verifyLoginToken, navigate])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await requestLoginLink(email)
    if (success) {
      setLinkSent(true)
    }
  }
  
  const handleAccessCodeSubmit = async (e) => {
    e.preventDefault()
    // In a real implementation, we would verify the access code here
    // For now, we'll just navigate to the request access page
    navigate('/request-access', { state: { accessCode } })
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        className="sacred-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sacred Symbol */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sacred-500 to-cosmic-500 flex items-center justify-center shadow-md cosmic-glow">
            <span className="text-white text-2xl font-display">✧</span>
          </div>
        </div>
        
        <motion.h1 
          className="text-2xl font-display text-sacred-900 text-center mb-2"
          variants={itemVariants}
        >
          {t('login.title')}
        </motion.h1>
        
        <motion.p 
          className="text-sacred-700 text-center mb-8"
          variants={itemVariants}
        >
          {t('login.subtitle')}
        </motion.p>
        
        {!linkSent ? (
          <motion.form 
            onSubmit={handleSubmit}
            variants={itemVariants}
          >
            <div className="sacred-form-group">
              <label htmlFor="email" className="sacred-label">
                {t('login.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                className="sacred-input"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="sacred-button w-full mb-4"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('login.sendLink')}
            </button>
            
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            
            <div className="text-center">
              <button
                type="button"
                className="text-sacred-600 hover:text-sacred-800 transition-colors text-sm"
                onClick={() => setShowAccessCode(!showAccessCode)}
              >
                {t('login.accessCode')}
              </button>
            </div>
            
            {showAccessCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <form onSubmit={handleAccessCodeSubmit}>
                  <div className="sacred-form-group">
                    <label htmlFor="accessCode" className="sacred-label">
                      {t('login.enterCode')}
                    </label>
                    <input
                      type="text"
                      id="accessCode"
                      className="sacred-input"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="sacred-button w-full"
                  >
                    {t('login.verifyCode')}
                  </button>
                </form>
              </motion.div>
            )}
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-earth-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-earth-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-xl font-display text-sacred-900 mb-2">
              {t('login.linkSent')}
            </h2>
            
            <p className="text-sacred-700 mb-6">
              {t('login.checkEmail')}
            </p>
            
            <button
              type="button"
              className="text-sacred-600 hover:text-sacred-800 transition-colors"
              onClick={() => setLinkSent(false)}
            >
              {t('common.back')}
            </button>
          </motion.div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sacred-700 text-sm">
            {t('login.noAccess')}{' '}
            <Link to="/request-access" className="text-sacred-600 hover:text-sacred-800 transition-colors">
              {t('login.requestAccess')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
