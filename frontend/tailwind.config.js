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
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#f5d7a4',        // soft gold
        'hover-gold': '#f0c676',         // hover gold
        'text-main': '#fff7e6',
        'text-subtle-heading': '#9ca3af',
        'text-muted': '#e0ccae',
        'text-light': '#fcf8ef',
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