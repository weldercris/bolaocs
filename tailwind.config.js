/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'StretchPro', 'sans-serif'],
        body: ['Outfit', 'MonaSans', 'sans-serif'],
      },
      colors: {
        ocean: '#0a1d42', // Azul bem escuro chique para textos principais
        ruby: '#009c3b',  // Verde do Brasil
        gold: '#ffdf00',  // Amarelo do Brasil
        background: { gray: '#f8f8f8' },
        secondary: 'gray',
        copa: {
          green: '#006341',
          'green-light': '#00854D',
          gold: '#C9A84C',
          'gold-light': '#F0C94A',
          dark: '#0A0F0D',
          'dark-2': '#111916',
          'dark-3': '#1A2420',
          'dark-4': '#243028',
        },
      },
      backgroundImage: {
        'grass': "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,0,0,0.03) 60px, rgba(0,0,0,0.03) 120px)",
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'loading-bar': 'loadingBar 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(201,168,76,0)' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
