/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#1C1C1E', // A slightly different dark gray
        surface: '#2C2C2E',    // A slightly lighter gray for cards/panels
        primary: '#F2F2F7',     // Off-white for primary text
        secondary: '#8E8E93',   // Grayer text for secondary info
        tertiary: '#48484A',    // Even dimmer text
        divider: '#3A3A3C',     // Border color
        'accent-blue': {
          DEFAULT: '#0A84FF', // A vibrant blue
          hover: '#007AFF',   // A slightly darker vibrant blue
        },
      },
      borderRadius: {
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
      },
    },
  },
  plugins: [],
}
