/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bsai: {
          pearl: '#F5F5F0',
          card: '#FFFFFF',
          cardSubtle: '#FCFAF6',
          border: '#E7E9E2',
          borderSubtle: '#EEF0EA',
          indigo: '#1C2925',
          indigoDark: '#16221C',
          indigoLight: '#536157',
          indigoMuted: '#79827C',
          saffron: '#BD9254',
          saffronLight: '#D2AA70',
          saffronDark: '#946D39',
          saffronBg: '#F6F1E8',
          teal: '#126A50',
          tealLight: '#3A8168',
          tealDark: '#0D503D',
          tealBg: '#EAF2EC',
          emerald: '#32805D',
          rose: '#EF4444',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Manrope', 'DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'bsai': '0 4px 20px -2px rgba(32, 42, 90, 0.05), 0 2px 6px -1px rgba(32, 42, 90, 0.03)',
        'bsai-lg': '0 12px 32px -4px rgba(32, 42, 90, 0.08), 0 4px 12px -2px rgba(32, 42, 90, 0.04)',
        'bsai-glow': '0 0 25px rgba(242, 169, 0, 0.25)',
        'bsai-teal-glow': '0 0 25px rgba(21, 154, 156, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
