/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#1a1a1a', // A very dark gray
        surface: '#2a2a2a',    // A slightly lighter gray for cards/panels
        primary: '#ffffff',     // White text
        secondary: '#a0a0a0',   // Grayer text for secondary info
        divider: '#3a3a3a',     // Border color
        'accent-blue': {
          DEFAULT: '#3b82f6', // blue-500
          hover: '#2563eb',   // blue-600
        },
      },
    },
  },
  plugins: [],
}
