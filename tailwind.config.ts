import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08090b',
        panel: '#101216',
        line: '#25282f',
        acid: '#d7ff45',
        sky: '#4db6ff',
        rose: '#ff6d8d',
      },
      boxShadow: {
        glow: '0 0 48px rgba(215, 255, 69, 0.16)',
      },
    },
  },
  plugins: [],
};

export default config;
