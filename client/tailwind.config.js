/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0',
          100: '#fdecd8',
          200: '#fbd5b0',
          300: '#f8b87d',
          400: '#f59347',
          500: '#f2751e',
          600: '#e35d13',
          700: '#bc4512',
          800: '#963816',
          900: '#7a3015',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        gold: {
          DEFAULT: '#BFA14A',
          dark: '#8C7A2A',
          light: '#F5E7B2',
        },
        black: '#181818',
        white: '#FFFFFF',
        // Diamond shop theme colors
        diamondWhite: '#F8F9FA',
        platinumSilver: '#E5E4E2',
        brilliantBlue: '#4F8EF7',
        champagneGold: '#FFD700',
        roseGold: '#B76E79',
        charcoalGray: '#333333',
        softBlush: '#F8E1E7',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Lora', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'elegant': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
} 