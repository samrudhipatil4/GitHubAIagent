/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        github: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#30363d',
          muted: '#8b949e',
          accent: '#238636',
          link: '#58a6ff',
          hover: '#21262d',
        },
      },
    },
  },
  plugins: [],
};
