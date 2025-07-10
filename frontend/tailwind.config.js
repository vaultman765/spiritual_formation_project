// tailwind.config.js
import plugin from 'tailwindcss/plugin';
import lineClamp from '@tailwindcss/line-clamp';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['EB Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#FFD56A',        // soft gold
        'hover-gold': '#FFE48A',
        'text-main': '#FFFFFF',
        'text-subtle-heading': '#FFD56A',
        'text-muted': '#D1C9D1',
        'text-light': '#EEE6F9',
        'text-tag': '#BDAAFF',
        'background-base': '#20003D',
        'background-section': '#2E005A',
      },
      boxShadow: {
        'inner-subtle': 'inset 0 0 6px rgba(255, 255, 255, 0.05)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    lineClamp,
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-balance': {
          textWrap: 'balance',
        },
      });
    }),
  ],
  darkMode: 'class',
};