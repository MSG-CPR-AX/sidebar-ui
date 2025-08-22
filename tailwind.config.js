/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme primary colors matching reference extension
        dark: {
          900: '#0b0b0f',
          800: '#1a1a23',
          700: '#2a2a37',
          600: '#3a3a4b',
          500: '#4a4a5f',
          400: '#6a6a7f',
          300: '#8a8a9f',
          200: '#aaaabf',
          100: '#cacacf',
        },
        // Accent colors for bookmarks
        accent: {
          blue: '#3b82f6',
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6',
          pink: '#ec4899',
          orange: '#f97316',
          teal: '#14b8a6',
        },
        // Semantic colors
        sidebar: {
          bg: '#0b0b0f',
          border: '#2a2a37',
          hover: '#3a3a4b',
          active: '#4a4a5f',
        },
        bookmark: {
          bg: '#1a1a23',
          hover: '#2a2a37',
          selected: '#3a3a4b',
          text: '#e5e5e5',
          muted: '#8a8a9f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-in-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      width: {
        'sidebar': '320px',
      },
      maxWidth: {
        'sidebar': '320px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}