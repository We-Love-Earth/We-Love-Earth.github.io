import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CreditContext = createContext(null)

export const useCredits = () => useContext(CreditContext)

export const CreditProvider = ({ children }) => {
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // Fetch user credits when user changes
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) {
        setCredits(0)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await axios.get('/api/credits')
        setCredits(response.data.credits)
      } catch (err) {
        console.error('Error fetching credits:', err)
        setError('Failed to load credit information')
      } finally {
        setLoading(false)
      }
    }

    fetchCredits()
  }, [user])

  // Calculate token costs
  const calculateInputCost = (text) => {
    // Approximate token count (very rough estimate)
    const tokenCount = Math.ceil(text.length / 4)
    // 6 credits per 1000 tokens (input)
    return Math.ceil((tokenCount / 1000) * 6)
  }

  const calculateOutputCost = (text) => {
    // Approximate token count (very rough estimate)
    const tokenCount = Math.ceil(text.length / 4)
    // 30 credits per 1000 tokens (output)
    return Math.ceil((tokenCount / 1000) * 30)
  }

  // Check if user has enough credits for an operation
  const hasEnoughCredits = (amount) => {
    return credits >= amount
  }

  // Update credits after a chat interaction
  const updateCreditsAfterChat = async (inputText, outputText) => {
    if (!user) return

    const inputCost = calculateInputCost(inputText)
    const outputCost = calculateOutputCost(outputText)
    const totalCost = inputCost + outputCost

    setCredits((prevCredits) => prevCredits - totalCost)

    try {
      await axios.post('/api/credits/use', {
        inputTokens: Math.ceil(inputText.length / 4),
        outputTokens: Math.ceil(outputText.length / 4),
      })
    } catch (err) {
      console.error('Error updating credits:', err)
      // Refresh credits from server to ensure accuracy
      const response = await axios.get('/api/credits')
      setCredits(response.data.credits)
    }
  }

  const value = {
    credits,
    loading,
    error,
    calculateInputCost,
    calculateOutputCost,
    hasEnoughCredits,
    updateCreditsAfterChat,
  }

  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>
}
