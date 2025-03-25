import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFoundPage = () => {
  const { t } = useTranslation()

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
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md"
      >
        {/* Sacred Symbol */}
        <motion.div 
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cosmic-400 to-sacred-500 flex items-center justify-center cosmic-glow">
            <span className="text-white text-4xl font-display">✧</span>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-display text-sacred-900 mb-4"
          variants={itemVariants}
        >
          Sacred Path Not Found
        </motion.h1>
        
        <motion.p 
          className="text-sacred-700 mb-8"
          variants={itemVariants}
        >
          The cosmic journey you seek has not yet manifested in this realm. Perhaps another path will lead you to the wisdom you seek.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <Link 
            to="/" 
            className="sacred-button inline-block"
          >
            Return to Sacred Home
          </Link>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-sacred-500 text-sm"
          variants={itemVariants}
        >
          "Sometimes getting lost is how we find our true path."
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
