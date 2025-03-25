import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'

const AccessRequestPage = () => {
  const { t } = useTranslation()
  const { requestAccess, loading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get access code from location state if available
  const accessCode = location.state?.accessCode || ''
  
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      name: '',
      email: '',
      intention: '',
      purpose: '',
      connection: '',
      astrorganism: '',
      accessCode: accessCode,
    }
  })
  
  const onSubmit = async (data) => {
    if (step < 3) {
      setStep(step + 1)
      return
    }
    
    const success = await requestAccess(data)
    if (success) {
      setSubmitted(true)
    }
  }
  
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }
  
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
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="sacred-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {!submitted ? (
          <>
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
              {t('accessRequest.title')}
            </motion.h1>
            
            <motion.p 
              className="text-sacred-700 text-center mb-8"
              variants={itemVariants}
            >
              {t('accessRequest.subtitle')}
            </motion.p>
            
            {/* Progress Steps */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === stepNumber
                        ? 'bg-sacred-600 text-white'
                        : step > stepNumber
                        ? 'bg-sacred-300 text-white'
                        : 'bg-sacred-100 text-sacred-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span className="text-xs mt-1 text-sacred-700">
                    {t(`accessRequest.step${stepNumber}`)}
                  </span>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="sacred-form-group">
                      <label htmlFor="name" className="sacred-label">
                        {t('accessRequest.nameLabel')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        className={`sacred-input ${errors.name ? 'border-red-500' : ''}`}
                        placeholder={t('accessRequest.namePlaceholder')}
                        {...register('name', { required: true })}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{t('common.required')}</p>
                      )}
                    </div>
                    
                    <div className="sacred-form-group">
                      <label htmlFor="email" className="sacred-label">
                        {t('accessRequest.emailLabel')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        className={`sacred-input ${errors.email ? 'border-red-500' : ''}`}
                        placeholder={t('accessRequest.emailPlaceholder')}
                        {...register('email', { 
                          required: true,
                          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                        })}
                      />
                      {errors.email?.type === 'required' && (
                        <p className="text-red-500 text-sm mt-1">{t('common.required')}</p>
                      )}
                      {errors.email?.type === 'pattern' && (
                        <p className="text-red-500 text-sm mt-1">Invalid email address</p>
                      )}
                    </div>
                    
                    <div className="sacred-form-group">
                      <label htmlFor="accessCode" className="sacred-label">
                        Access Code <span className="text-sacred-500">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="accessCode"
                        className="sacred-input"
                        {...register('accessCode')}
                      />
                      <p className="text-xs text-sacred-600 mt-1">
                        If you have an access code, enter it here
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="sacred-form-group">
                      <label htmlFor="intention" className="sacred-label">
                        {t('accessRequest.intentionLabel')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="intention"
                        className={`sacred-input min-h-[120px] ${errors.intention ? 'border-red-500' : ''}`}
                        placeholder={t('accessRequest.intentionPlaceholder')}
                        {...register('intention', { required: true })}
                      />
                      {errors.intention && (
                        <p className="text-red-500 text-sm mt-1">{t('common.required')}</p>
                      )}
                    </div>
                    
                    <div className="sacred-form-group">
                      <label htmlFor="purpose" className="sacred-label">
                        {t('accessRequest.purposeLabel')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="purpose"
                        className={`sacred-input min-h-[120px] ${errors.purpose ? 'border-red-500' : ''}`}
                        placeholder={t('accessRequest.purposePlaceholder')}
                        {...register('purpose', { required: true })}
                      />
                      {errors.purpose && (
                        <p className="text-red-500 text-sm mt-1">{t('common.required')}</p>
                      )}
                    </div>
                  </motion.div>
                )}
                
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="sacred-form-group">
                      <label htmlFor="connection" className="sacred-label">
                        {t('accessRequest.connectionLabel')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="connection"
                        className={`sacred-input min-h-[120px] ${errors.connection ? 'border-red-500' : ''}`}
                        placeholder={t('accessRequest.connectionPlaceholder')}
                        {...register('connection', { required: true })}
                      />
                      {errors.connection && (
                        <p className="text-red-500 text-sm mt-1">{t('common.required')}</p>
                      )}
                    </div>
                    
                    <div className="sacred-form-group">
                      <label htmlFor="astrorganism" className="sacred-label">
                        {t('accessRequest.astrorganismLabel')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="astrorganism"
                        className={`sacred-input min-h-[120px] ${errors.astrorganism ? 'border-red-500' : ''}`}
                        placeholder={t('accessRequest.astrorganismPlaceholder')}
                        {...register('astrorganism', { required: true })}
                      />
                      {errors.astrorganism && (
                        <p className="text-red-500 text-sm mt-1">{t('common.required')}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
              )}
              
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    className="px-6 py-2 bg-white text-sacred-700 border border-sacred-600 rounded-full hover:bg-sacred-50 transition-colors"
                    onClick={goBack}
                  >
                    {t('common.back')}
                  </button>
                ) : (
                  <div></div>
                )}
                
                <button
                  type="submit"
                  className="sacred-button"
                  disabled={loading}
                >
                  {loading 
                    ? t('common.loading')
                    : step < 3 
                      ? t('common.next')
                      : t('common.submit')
                  }
                </button>
              </div>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-earth-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-earth-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-xl font-display text-sacred-900 mb-2">
              {t('accessRequest.submitted')}
            </h2>
            
            <p className="text-sacred-700 mb-6">
              {t('accessRequest.submittedDescription')}
            </p>
            
            <button
              type="button"
              className="sacred-button"
              onClick={() => navigate('/')}
            >
              {t('common.back')}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default AccessRequestPage
