import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useCredits } from '../../contexts/CreditContext'
import LanguageSwitcher from '../common/LanguageSwitcher'

const MainLayout = () => {
  const { t } = useTranslation()
  const { user, logout, isAdmin } = useAuth()
  const { credits } = useCredits()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-sacred-gradient">
      {/* Sacred geometric pattern overlay */}
      <div className="fixed inset-0 bg-cosmic-pattern opacity-5 pointer-events-none z-0"></div>
      
      {/* Header */}
      <header className="relative z-10">
        <nav className="sacred-container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div 
                className="w-10 h-10 rounded-full bg-sacred-600 flex items-center justify-center text-white font-display text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                L
              </motion.div>
              <span className="text-2xl font-display text-sacred-900">Luna</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors">
                {t('nav.home')}
              </Link>
              
              {user ? (
                <>
                  <Link to="/chat" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors">
                    {t('nav.chat')}
                  </Link>
                  <Link to="/profile" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors">
                    {t('nav.profile')}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors">
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="font-display text-sacred-800 hover:text-sacred-600 transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors">
                    {t('nav.login')}
                  </Link>
                  <Link to="/request-access" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors">
                    {t('nav.requestAccess')}
                  </Link>
                </>
              )}
              
              <LanguageSwitcher />
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sacred-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 py-4 sacred-card"
              >
                <div className="flex flex-col space-y-4">
                  <Link to="/" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors px-4">
                    {t('nav.home')}
                  </Link>
                  
                  {user ? (
                    <>
                      <Link to="/chat" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors px-4">
                        {t('nav.chat')}
                      </Link>
                      <Link to="/profile" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors px-4">
                        {t('nav.profile')}
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors px-4">
                          {t('nav.admin')}
                        </Link>
                      )}
                      <button 
                        onClick={logout}
                        className="font-display text-sacred-800 hover:text-sacred-600 transition-colors text-left px-4"
                      >
                        {t('nav.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors px-4">
                        {t('nav.login')}
                      </Link>
                      <Link to="/request-access" className="font-display text-sacred-800 hover:text-sacred-600 transition-colors px-4">
                        {t('nav.requestAccess')}
                      </Link>
                    </>
                  )}
                  
                  <div className="px-4">
                    <LanguageSwitcher />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
      
      {/* Credits display for authenticated users */}
      {user && (
        <div className="fixed top-4 right-4 z-20">
          <div className="sacred-card py-2 px-4 flex items-center space-x-2">
            <span className="text-cosmic-600 font-display">✧</span>
            <span className="font-display text-sacred-800">{t('common.creditsAvailable', { count: credits })}</span>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sacred-container py-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="py-8 bg-white bg-opacity-30 backdrop-blur-sm relative z-10">
        <div className="sacred-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-display text-sacred-800 text-center md:text-left">
                Luna - Sacred Gateway to Planetary Consciousness
              </p>
              <p className="text-sm text-sacred-600 text-center md:text-left">
                &copy; {new Date().getFullYear()} We Love Earth
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="https://we-love.earth" target="_blank" rel="noopener noreferrer" className="text-sacred-800 hover:text-sacred-600 transition-colors">
                We Love Earth
              </a>
              <a href="https://ko-fi.com/weloveearth" target="_blank" rel="noopener noreferrer" className="text-sacred-800 hover:text-sacred-600 transition-colors">
                Ko-fi
              </a>
              <a href="mailto:contact@we-love.earth" className="text-sacred-800 hover:text-sacred-600 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
