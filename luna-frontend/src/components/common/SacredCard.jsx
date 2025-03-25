import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import SacredSymbol from './SacredSymbol'

const SacredCard = ({ 
  children, 
  title,
  symbol,
  variant = 'default',
  elevation = 'medium',
  animate = true,
  className = '',
  ...props 
}) => {
  // Base styles
  const baseStyles = "rounded-xl overflow-hidden backdrop-blur-sm"
  
  // Variant styles
  const variantStyles = {
    default: "bg-white/90 border border-sacred-200",
    sacred: "bg-gradient-to-br from-white/95 to-sacred-50/90 border border-sacred-200",
    cosmic: "bg-gradient-to-br from-white/95 to-cosmic-50/90 border border-cosmic-200",
    earth: "bg-gradient-to-br from-white/95 to-earth-50/90 border border-earth-200",
    glass: "bg-white/30 border border-white/40",
    dark: "bg-sacred-900/90 text-white border border-sacred-700"
  }
  
  // Elevation styles
  const elevationStyles = {
    none: "",
    low: "shadow-sm",
    medium: "shadow-md",
    high: "shadow-lg",
    cosmic: "shadow-xl cosmic-glow-subtle"
  }
  
  // Combined styles
  const cardStyles = `${baseStyles} ${variantStyles[variant]} ${elevationStyles[elevation]} ${className}`
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }
  
  const subtleAnimationVariants = {
    animate: {
      boxShadow: [
        "0 4px 6px -1px rgba(169, 142, 255, 0.1), 0 2px 4px -1px rgba(169, 142, 255, 0.06)",
        "0 4px 6px -1px rgba(169, 142, 255, 0.2), 0 2px 4px -1px rgba(169, 142, 255, 0.12)",
        "0 4px 6px -1px rgba(169, 142, 255, 0.1), 0 2px 4px -1px rgba(169, 142, 255, 0.06)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }

  return (
    <motion.div
      className={cardStyles}
      variants={cardVariants}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      whileHover={animate ? { scale: 1.01 } : undefined}
      {...(animate && elevation === 'cosmic' ? { 
        variants: subtleAnimationVariants,
        animate: "animate"
      } : {})}
      {...props}
    >
      {(title || symbol) && (
        <div className="flex items-center p-4 border-b border-sacred-100">
          {symbol && (
            <div className="mr-2">
              <SacredSymbol symbol={symbol} color={variant === 'dark' ? 'white' : 'sacred'} />
            </div>
          )}
          {title && (
            <h3 className={`font-display ${variant === 'dark' ? 'text-white' : 'text-sacred-800'}`}>
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  )
}

SacredCard.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  symbol: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'sacred', 'cosmic', 'earth', 'glass', 'dark']),
  elevation: PropTypes.oneOf(['none', 'low', 'medium', 'high', 'cosmic']),
  animate: PropTypes.bool,
  className: PropTypes.string
}

export default SacredCard
