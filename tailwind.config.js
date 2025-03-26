/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cosmic-purple': 'var(--cosmic-purple)',
        'nebula-blue': 'var(--nebula-blue)',
        starlight: 'var(--starlight)',
        'deep-space': 'var(--deep-space)',
      },
    },
  },
  plugins: [],
}
