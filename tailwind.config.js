/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#0a0a23',
        'neon-green': '#00ff88',
      },
    },
  },
  plugins: [],
};
