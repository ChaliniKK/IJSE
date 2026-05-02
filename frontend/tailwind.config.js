/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff4757',
          hover: '#ff6b81',
        },
        secondary: '#2f3542',
        accent: '#ffa502',
        background: '#f1f2f6',
        surface: '#ffffff',
      },
      borderRadius: {
        'xl': '16px',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
