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
        // Core Brand Colors (AMOLED Premium)
        'core-dark': '#000000',        // Fundo principal - preto absoluto
        'core-card': '#1A1A1A',        // Cards - cinza escuro elegante  
        'core-card-light': '#2A2A2A',  // Cinza mais claro
        'core-border': '#3E3E3E',      // Bordas e bolinhas de ícones
        
  // Primary Colors (kept for semantic use but not app-wide highlight)
  'core-primary': '#14b8a6',
  'core-primary-dark': '#0d9488',
  'core-primary-light': '#2dd4bf',
        
        // Secondary Colors (Purple Accent)
        'core-secondary': '#6C5CE7',
        'core-secondary-dark': '#5A4FCF',
        'core-secondary-light': '#A29BFE',
        
        // Status Colors
        'core-success': '#22c55e',
        'core-error': '#ef4444',
        'core-warning': '#f59e0b',
        'core-info': '#74B9FF',
        
        // Text Colors (AMOLED Premium)
        'core-text-primary': '#FFFFFF',    // Texto principal - branco absoluto
        'core-text-secondary': '#3E3E3E',  // Subtextos - cinza médio
        'core-text-muted': '#3E3E3E',      // Texto sutil - MESMA COR DAS BOLINHAS
        
  // Background Gradients (use subtle purple -> accent)
  'gradient-start': '#6C5CE7',
  'gradient-end': '#FFFFFF',
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