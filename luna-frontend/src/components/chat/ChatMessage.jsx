import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import SacredSymbol from '../common/SacredSymbol'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true
})

const ChatMessage = ({ 
  message, 
  isUser = false,
  animate = true,
  showTimestamp = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Parse markdown for Luna's messages
  const getFormattedContent = () => {
    if (isUser) return message.content
    
    // Convert markdown to HTML and sanitize
    const rawMarkup = marked(message.content)
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup)
    
    return (
      <div 
        className="prose prose-sacred max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedMarkup }} 
      />
    )
  }
  
  // Determine if message is long and should be collapsible
  const isLongMessage = !isUser && message.content.length > 500
  
  // Animation variants
  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      x: isUser ? 20 : -20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }
  
  // Subtle animation for Luna's messages
  const lunaAnimationVariants = {
    animate: {
      boxShadow: [
        "0 4px 6px -1px rgba(169, 142, 255, 0.1), 0 2px 4px -1px rgba(169, 142, 255, 0.06)",
        "0 4px 6px -1px rgba(169, 142, 255, 0.2), 0 2px 4px -1px rgba(169, 142, 255, 0.12)",
        "0 4px 6px -1px rgba(169, 142, 255, 0.1), 0 2px 4px -1px rgba(169, 142, 255, 0.06)"
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }
  
  // Styles for message container
  const messageContainerStyles = `
    max-w-[85%] rounded-2xl p-4 
    ${isUser 
      ? 'bg-gradient-to-br from-sacred-600 to-sacred-700 text-white ml-auto' 
      : 'bg-white border border-sacred-200 text-sacred-800'
    }
    ${!isUser && animate ? 'cosmic-glow-subtle' : ''}
  `

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      variants={messageVariants}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
    >
      <motion.div 
        className={messageContainerStyles}
        {...(!isUser && animate ? { 
          variants: lunaAnimationVariants,
          animate: "animate"
        } : {})}
      >
        {/* Message header for Luna's messages */}
        {!isUser && (
          <div className="flex items-center mb-2">
            <SacredSymbol symbol="consciousness" size="small" color="sacred" animate={false} />
            <span className="ml-2 font-display text-sacred-800">Luna</span>
          </div>
        )}
        
        {/* Message content */}
        <div className={`${isLongMessage && !isExpanded ? 'max-h-60 overflow-hidden relative' : ''}`}>
          {getFormattedContent()}
          
          {/* Gradient fade for long collapsed messages */}
          {isLongMessage && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>
        
        {/* Expand/collapse button for long messages */}
        {isLongMessage && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sacred-600 text-sm flex items-center hover:text-sacred-800 transition-colors"
          >
            {isExpanded ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Show less
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Read more
              </>
            )}
          </button>
        )}
        
        {/* Timestamp */}
        {showTimestamp && (
          <div 
            className={`text-xs mt-2 ${
              isUser ? 'text-sacred-200' : 'text-sacred-400'
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired
  }).isRequired,
  isUser: PropTypes.bool,
  animate: PropTypes.bool,
  showTimestamp: PropTypes.bool
}

export default ChatMessage
