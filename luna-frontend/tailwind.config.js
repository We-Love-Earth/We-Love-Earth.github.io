/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sacred color palette
        sacred: {
          100: '#f0f4ff', // Light ethereal blue
          200: '#d9e6ff', // Soft sky blue
          300: '#b3c6ff', // Gentle lavender
          400: '#809fff', // Medium periwinkle
          500: '#4d79ff', // Vibrant blue
          600: '#3366ff', // Deep blue
          700: '#1a53ff', // Rich blue
          800: '#0040ff', // Intense blue
          900: '#0033cc', // Deep royal blue
        },
        earth: {
          100: '#e6f7e6', // Light mint
          200: '#c2eac2', // Soft green
          300: '#99d699', // Medium green
          400: '#70c270', // Vibrant green
          500: '#47b347', // Rich green
          600: '#339933', // Deep green
          700: '#267326', // Forest green
          800: '#1a4d1a', // Dark green
          900: '#0d260d', // Deep forest
        },
        cosmic: {
          100: '#f2e6ff', // Light lavender
          200: '#e6ccff', // Soft lavender
          300: '#d9b3ff', // Medium lavender
          400: '#cc99ff', // Vibrant lavender
          500: '#bf80ff', // Rich purple
          600: '#b366ff', // Deep purple
          700: '#a64dff', // Intense purple
          800: '#9933ff', // Vivid purple
          900: '#8c1aff', // Deep violet
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        display: ['Cinzel', 'serif'],
        body: ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'sacred-gradient': 'linear-gradient(135deg, #f0f4ff 0%, #e6f7e6 50%, #f2e6ff 100%)',
        'cosmic-pattern': "url('/sacred-symbols/cosmic-pattern.svg')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(77, 121, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(77, 121, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
