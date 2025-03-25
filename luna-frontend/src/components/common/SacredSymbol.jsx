import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const symbols = {
  star: "✧",
  flower: "✿",
  sun: "☀",
  moon: "☽",
  infinity: "∞",
  om: "ॐ",
  lotus: "⚘",
  spiral: "➰",
  eye: "👁",
  earth: "🜨",
  merkaba: "✡",
  vesica: "◕",
  wave: "〰",
  unity: "☯",
  consciousness: "⚛"
}

const SacredSymbol = ({ 
  symbol = 'star',
  size = 'medium',
  color = 'sacred',
  animate = true,
  className = '',
  ...props 
}) => {
  // Get the symbol character
  const symbolChar = symbols[symbol] || symbols.star
  
  // Size styles
  const sizeStyles = {
    tiny: "text-lg",
    small: "text-xl",
    medium: "text-2xl",
    large: "text-3xl",
    xlarge: "text-4xl",
    huge: "text-5xl"
  }
  
  // Color styles
  const colorStyles = {
    sacred: "text-sacred-600",
    cosmic: "text-cosmic-500",
    earth: "text-earth-600",
    white: "text-white",
    gold: "text-amber-500",
    silver: "text-gray-300",
    gradient: "bg-clip-text text-transparent bg-gradient-to-r from-sacred-500 to-cosmic-500"
  }
  
  // Animation variants
  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }
  
  const rotateVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }
  
  const floatVariants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }
  
  // Choose a random animation or none
  const getAnimation = () => {
    if (!animate) return {}
    
    const animations = [pulseVariants, rotateVariants, floatVariants]
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)]
    
    return {
      variants: randomAnimation,
      animate: "animate"
    }
  }
  
  const animationProps = getAnimation()
  
  return (
    <motion.span
      className={`inline-block font-display ${sizeStyles[size]} ${colorStyles[color]} ${className}`}
      {...animationProps}
      {...props}
    >
      {symbolChar}
    </motion.span>
  )
}

SacredSymbol.propTypes = {
  symbol: PropTypes.oneOf(Object.keys(symbols)),
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'xlarge', 'huge']),
  color: PropTypes.oneOf(['sacred', 'cosmic', 'earth', 'white', 'gold', 'silver', 'gradient']),
  animate: PropTypes.bool,
  className: PropTypes.string
}

export default SacredSymbol
