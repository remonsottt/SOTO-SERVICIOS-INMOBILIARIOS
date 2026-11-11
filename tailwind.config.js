/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f2f7f3',
          100: '#e0ece2',
          200: '#c2d9c6',
          300: '#97bf9e',
          400: '#659c6e',
          500: '#3e7d49',
          600: '#2d6337',
          700: '#223e28',
          800: '#1a3020',
          900: '#0f1f12',
        },
        sand: {
          50:  '#faf8f5',
          100: '#f4efe8',
          200: '#e8ddd0',
          300: '#d6c5b0',
          400: '#bfa588',
          500: '#998675',
          600: '#7a6a5e',
          700: '#5e5049',
          800: '#3d3530',
          900: '#1f1b18',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':       '0 1px 3px 0 rgba(15,31,18,0.06), 0 1px 2px -1px rgba(15,31,18,0.04)',
        'card-hover': '0 10px 30px -8px rgba(15,31,18,0.15)',
        'glass':      '0 8px 32px 0 rgba(15,31,18,0.08)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
