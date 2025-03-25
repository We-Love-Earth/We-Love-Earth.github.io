import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SacredSymbol from './SacredSymbol'

/**
 * SacredNotification - A component for displaying notifications with sacred aesthetics
 * 
 * @param {Object} props
 * @param {string} props.type - The type of notification ('success', 'error', 'info', 'warning')
 * @param {string} props.title - The title of the notification
 * @param {string} props.message - The message content of the notification
 * @param {number} props.duration - Duration in milliseconds before auto-dismissing (0 for persistent)
 * @param {function} props.onClose - Function to call when notification is closed
 * @param {boolean} props.show - Whether to show the notification
 */
const SacredNotification = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  show = true
}) => {
  const [isVisible, setIsVisible] = useState(show)
  
  // Handle auto-dismiss
  useEffect(() => {
    setIsVisible(show)
    
    let timer
    if (show && duration > 0) {
      timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, duration)
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [show, duration, onClose])
  
  // Handle manual close
  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }
  
  // Determine symbol and colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          symbol: 'unity',
          bgColor: 'bg-earth-50',
          borderColor: 'border-earth-200',
          iconColor: 'earth',
          titleColor: 'text-earth-800',
          messageColor: 'text-earth-600'
        }
      case 'error':
        return {
          symbol: 'consciousness',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'red',
          titleColor: 'text-red-800',
          messageColor: 'text-red-600'
        }
      case 'warning':
        return {
          symbol: 'spiral',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconColor: 'amber',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-600'
        }
      case 'info':
      default:
        return {
          symbol: 'infinity',
          bgColor: 'bg-sacred-50',
          borderColor: 'border-sacred-200',
          iconColor: 'sacred',
          titleColor: 'text-sacred-800',
          messageColor: 'text-sacred-600'
        }
    }
  }
  
  const config = getTypeConfig()
  
  // Animation variants
  const notificationVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed top-4 right-4 z-50 max-w-md w-full ${config.bgColor} border ${config.borderColor} rounded-lg shadow-lg overflow-hidden`}
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <SacredSymbol 
                  symbol={config.symbol} 
                  size="medium" 
                  color={config.iconColor} 
                />
              </div>
              
              <div className="ml-3 w-0 flex-1">
                {title && (
                  <h3 className={`text-sm font-medium ${config.titleColor}`}>
                    {title}
                  </h3>
                )}
                
                {message && (
                  <div className={`mt-1 text-sm ${config.messageColor}`}>
                    <p>{message}</p>
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className={`inline-flex rounded-md ${config.messageColor} focus:outline-none focus:ring-2 focus:ring-sacred-500`}
                  onClick={handleClose}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Animated progress bar for auto-dismiss */}
          {duration > 0 && (
            <motion.div 
              className="h-1 bg-sacred-500"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SacredNotification
