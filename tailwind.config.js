/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#e0e9fe',
          200: '#c5d7fc',
          300: '#9dbaf9',
          400: '#6c93f4',
          500: '#2563eb', // Vibrant Blue accent
          600: '#1d4ed8',
          700: '#1d40b0',
          800: '#0F2C59', // Deep Royal Navy (main brand color)
          900: '#0b1a30',
        },
        accent: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ff3f3f', // SliceCraft Tomato Red
          600: '#e11d48', // Vibrant Crimson
          700: '#be123c',
          800: '#9f1239',
          900: '#4c0519',
        },
        cheese: {
          50: '#fffdf5',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#f59e0b', // Golden Cheese Yellow
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(255, 63, 63, 0.15)',
      }
    },
  },
  plugins: [],
}
