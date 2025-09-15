/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Core Brand Colors (Dark Theme)
        'core-dark': '#0A0A0F',
        'core-darker': '#060609',
        'core-card': '#131318',
        'core-card-light': '#1A1A21',
        'core-border': '#2A2A35',
        
        // Primary Colors (Financial Green)
        'core-primary': '#00D4AA',
        'core-primary-dark': '#00B894',
        'core-primary-light': '#00E6C3',
        
        // Secondary Colors (Purple Accent)
        'core-secondary': '#6C5CE7',
        'core-secondary-dark': '#5A4FCF',
        'core-secondary-light': '#A29BFE',
        
        // Status Colors
        'core-success': '#00B894',
        'core-error': '#E17055',
        'core-warning': '#FDCB6E',
        'core-info': '#74B9FF',
        
        // Text Colors
        'core-text-primary': '#FFFFFF',
        'core-text-secondary': '#B2B2C7',
        'core-text-muted': '#74747E',
        
        // Background Gradients
        'gradient-start': '#6C5CE7',
        'gradient-end': '#00D4AA',
      },
      fontFamily: {
        'core-regular': ['Inter_400Regular'],
        'core-medium': ['Inter_500Medium'],
        'core-semibold': ['Inter_600SemiBold'],
        'core-bold': ['Inter_700Bold'],
      },
      fontSize: {
        'core-xs': '12px',
        'core-sm': '14px',
        'core-base': '16px',
        'core-lg': '18px',
        'core-xl': '20px',
        'core-2xl': '24px',
        'core-3xl': '30px',
        'core-4xl': '36px',
      },
      spacing: {
        'core-xs': '4px',
        'core-sm': '8px',
        'core-md': '16px',
        'core-lg': '24px',
        'core-xl': '32px',
        'core-2xl': '48px',
      },
      borderRadius: {
        'core-sm': '8px',
        'core-md': '12px',
        'core-lg': '16px',
        'core-xl': '20px',
      },
      boxShadow: {
        'core-sm': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'core-md': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'core-lg': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}