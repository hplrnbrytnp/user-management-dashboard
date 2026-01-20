module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary teal
        teal: {
          DEFAULT: '#1B8A93',
          dark: '#156E75',
          light: '#2AA3AD',
        },
        // Background colors
        periwinkle: '#E8EAF6',
        // Dark theme palette
        dark: {
          900: '#0f1419',
          800: '#15202b',
          700: '#1c2938',
          600: '#253341',
          500: '#38444d',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-teal': '0 0 30px rgba(27, 138, 147, 0.25)',
        'card': '0 2px 12px rgba(27, 138, 147, 0.08)',
        'card-hover': '0 8px 30px rgba(27, 138, 147, 0.15)',
      },
    },
  },
  plugins: [],
};
