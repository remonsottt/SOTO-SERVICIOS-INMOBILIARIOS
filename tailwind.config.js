/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand primary forest — centered on official #28352b
        forest: {
          50:  '#f3f5f3',
          100: '#e4e9e5',
          200: '#c8d1ca',
          300: '#a3b1a6',
          400: '#7a8c7e',
          500: '#5a6d5e',
          600: '#3f4f43',
          700: '#28352b', // official brand primary
          800: '#1a221c', // deeper forest (footer / hero overlays)
          900: '#121814',
        },
        // Cool limestone neutrals for surfaces (not cream)
        mist: {
          50:  '#f7f8f7',
          100: '#eef1ef',
          200: '#dde3df',
          300: '#c2cdc6',
          400: '#9aaba1',
          500: '#748578',
          600: '#5a6960',
          700: '#47534c',
          800: '#3a443e',
          900: '#313933',
        },
        // Secondary taupe #998675 — accent/logo scale only (do not flood UI fills)
        sand: {
          50:  '#f7f5f3',
          100: '#efebe7',
          200: '#ddd4cb',
          300: '#c4b5a6',
          400: '#b09a88',
          500: '#998675', // official brand secondary / accent
          600: '#7d6c5e',
          700: '#65564c',
          800: '#524740',
          900: '#443c37',
        },
      },
      fontFamily: {
        // UI: Avenir (system) with Nunito Sans web fallback — Avenir is not on Google Fonts
        sans:  ['Avenir Next', 'Avenir', 'Nunito Sans', 'ui-sans-serif', 'sans-serif'],
        // Display / brand hero text — complements logo serif; do not redraw logo in CSS
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card':       '0 1px 2px 0 rgba(40,53,43,0.04)',
        'card-hover': '0 16px 40px -16px rgba(40,53,43,0.18)',
        'glass':      '0 8px 32px 0 rgba(40,53,43,0.08)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'ken-burns': 'kenBurns 22s ease-out forwards',
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
        kenBurns: {
          '0%':   { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};
