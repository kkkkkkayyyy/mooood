/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        chewy: ['Chewy', 'cursive'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        bg: '#FFFEFA',
        'neutral-900': '#272724',
        'neutral-800': '#656359',
        'primary-100': '#F5F7FF',
        'primary-200': '#F0F3FF',
        'primary-300': '#E0E6FF',
        'primary-400': '#C2CDFF',
        'primary-500': '#9CADFF',
        'primary-900': '#373D59',
        'calma-100': '#E8F5EA',
        'calma-200': '#BCE5C1',
        'calma-300': '#A4DDAB',
        'calma-400': '#7EC987',
        'tension-100': '#FFF0E8',
        'tension-200': '#FFCEB6',
        'tension-300': '#F0A580',
        'tension-400': '#E07A50',
        'impulso-100': '#FFFBE0',
        'impulso-200': '#FFF1B7',
        'impulso-300': '#FDE478',
        'impulso-400': '#F3D13F',
        'tristeza-100': '#E8F2FF',
        'tristeza-200': '#9CC4FF',
        'tristeza-300': '#4782D5',
        'tristeza-400': '#2A5CB5',
        gris: '#EFEFEF',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'breathe-2': 'breathe 8s ease-in-out infinite 0.3s',
        'breathe-3': 'breathe 8s ease-in-out infinite 0.6s',
        'breathe-4': 'breathe 8s ease-in-out infinite 0.9s',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.12)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(156, 173, 255, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(156, 173, 255, 0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
