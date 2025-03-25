import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const SacredButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  // Base styles
  const baseStyles = "font-display rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sacred-500 focus:ring-opacity-50"
  
  // Size styles
  const sizeStyles = {
    small: "px-4 py-1 text-sm",
    medium: "px-6 py-2",
    large: "px-8 py-3 text-lg"
  }
  
  // Variant styles
  const variantStyles = {
    primary: "bg-gradient-to-r from-sacred-500 to-cosmic-500 text-white hover:from-sacred-600 hover:to-cosmic-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed cosmic-glow",
    secondary: "bg-white text-sacred-700 border border-sacred-500 hover:bg-sacred-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed",
    earth: "bg-gradient-to-r from-earth-500 to-earth-700 text-white hover:from-earth-600 hover:to-earth-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed",
    cosmic: "bg-gradient-to-r from-cosmic-400 to-cosmic-600 text-white hover:from-cosmic-500 hover:to-cosmic-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
  }
  
  // Width style
  const widthStyle = fullWidth ? "w-full" : ""
  
  // Combined styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`
  
  // Button animation
  const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
    disabled: { scale: 1 }
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
      variants={buttonVariants}
      whileHover={disabled ? "disabled" : "hover"}
      whileTap={disabled ? "disabled" : "tap"}
      {...props}
    >
      {children}
    </motion.button>
  )
}

SacredButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'earth', 'cosmic']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string
}

export default SacredButton
