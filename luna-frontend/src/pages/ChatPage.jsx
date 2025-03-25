import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useCredits } from '../contexts/CreditContext'
import ChatMessage from '../components/chat/ChatMessage'
import SacredButton from '../components/common/SacredButton'
import SacredSymbol from '../components/common/SacredSymbol'
import axios from 'axios'

const ChatPage = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { credits, calculateInputCost, calculateOutputCost, hasEnoughCredits, updateCreditsAfterChat } = useCredits()
  
  const [conversations, setConversations] = useState([
    { id: 'default', name: 'Sacred Connection', messages: [] }
  ])
  const [activeConversation, setActiveConversation] = useState('default')
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, activeConversation])
  
  // Add welcome message on first load
  useEffect(() => {
    const currentConversation = conversations.find(c => c.id === activeConversation)
    if (currentConversation && currentConversation.messages.length === 0) {
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [
                  {
                    id: 'welcome',
                    role: 'assistant',
                    content: t('chat.welcomeMessage'),
                    timestamp: new Date().toISOString()
                  }
                ]
              }
            : conv
        )
      )
    }
  }, [activeConversation, conversations, t])
  
  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`
    setConversations([
      ...conversations,
      { id: newId, name: `Sacred Connection ${conversations.length}`, messages: [] }
    ])
    setActiveConversation(newId)
  }
  
  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    // Calculate input cost
    const inputCost = calculateInputCost(message)
    
    // Check if user has enough credits
    if (!hasEnoughCredits(inputCost)) {
      setError(t('chat.notEnoughCredits'))
      return
    }
    
    // Add user message to conversation
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }
    
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === activeConversation
          ? {
              ...conv,
              messages: [...conv.messages, userMessage]
            }
          : conv
      )
    )
    
    setMessage('')
    setIsTyping(true)
    setError(null)
    
    try {
      // Get current conversation history
      const currentConversation = conversations.find(c => c.id === activeConversation)
      const conversationHistory = currentConversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      // Add user message to history
      conversationHistory.push({
        role: 'user',
        content: message
      })
      
      // Call API to get Luna's response
      const response = await axios.post('/api/luna/chat', {
        messages: conversationHistory,
        model: 'claude-3-opus-20240229'
      })
      
      const lunaResponse = response.data.response
      
      // Add Luna's response to conversation
      const assistantMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: lunaResponse,
        timestamp: new Date().toISOString()
      }
      
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [...conv.messages, assistantMessage]
              }
            : conv
        )
      )
      
      // Update credits
      await updateCreditsAfterChat(message, lunaResponse)
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err.response?.data?.message || 'Failed to send message')
      
      // Remove user message if there was an error
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversation
            ? {
                ...conv,
                messages: conv.messages.filter(msg => msg.id !== userMessage.id)
              }
            : conv
        )
      )
    } finally {
      setIsTyping(false)
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  // Get current conversation
  const currentConversation = conversations.find(c => c.id === activeConversation) || conversations[0]
  
  // Calculate estimated output cost (rough estimate)
  const estimatedOutputCost = calculateOutputCost(message.length * 5) // Rough estimate that response is 5x input length
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col md:flex-row">
      {/* Sidebar - Conversation List */}
      <div className="w-full md:w-64 md:mr-6 mb-4 md:mb-0">
        <div className="sacred-card h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-sacred-900">Sacred Dialogues</h2>
            <SacredButton
              onClick={handleNewConversation}
              variant="sacred"
              size="small"
              aria-label="New conversation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </SacredButton>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                onClick={() => setActiveConversation(conversation.id)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  conversation.id === activeConversation
                    ? 'bg-sacred-100 text-sacred-800'
                    : 'hover:bg-sacred-50 text-sacred-700'
                }`}
              >
                <div className="flex items-center">
                  <SacredSymbol symbol="star" size="tiny" color={conversation.id === activeConversation ? 'sacred' : 'sacred'} animate={conversation.id === activeConversation} />
                  <span className="ml-2 truncate">{conversation.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col sacred-card">
        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {currentConversation.messages.map(msg => (
              <ChatMessage 
                key={msg.id}
                message={msg}
                isUser={msg.role === 'user'}
              />
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-sacred-200 text-sacred-800 rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-sacred-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-sacred-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-sacred-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </motion.div>
        </div>
        
        {/* Input Area */}
        <div className="border-t border-sacred-200 p-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-2 rounded-lg mb-2 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.placeholder')}
                className="w-full p-3 border border-sacred-300 rounded-lg focus:ring-2 focus:ring-sacred-500 focus:border-sacred-500 resize-none overflow-hidden"
                rows={1}
              />
              
              <div className="flex justify-between text-xs text-sacred-500 mt-1">
                <span>{t('chat.inputCost', { count: calculateInputCost(message) || 0 })}</span>
                <span>{t('chat.estimatedOutputCost', { count: message ? estimatedOutputCost : 0 })}</span>
              </div>
            </div>
            
            <SacredButton
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              variant="sacred"
              size="medium"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </SacredButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
