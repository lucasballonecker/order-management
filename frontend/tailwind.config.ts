import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Ubuntu',
          'Cantarell',
          'Noto Sans',
          'sans-serif',
        ],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'hard': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [
    // @ts-expect-error - plugin types
    function({ addBase, addComponents }) {
      addBase({
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        'html': {
          lineHeight: '1.15',
        },
        'body': {
          margin: '0',
          lineHeight: '1.5',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        'hr': {
          height: '0',
          color: 'inherit',
          borderTopWidth: '1px',
        },
        'abbr:where([title])': {
          textDecoration: 'underline dotted',
        },
        'a': {
          color: 'inherit',
          textDecoration: 'inherit',
        },
        'b, strong': {
          fontWeight: 'bolder',
        },
      })
      
      addComponents({
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          borderRadius: '0.5rem',
          border: '1px solid transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 'var(--tw-shadow, 0 0 #0000)',
          },
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: '0 0 0 3px rgb(59 130 246 / 0.5)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
          },
        },
        
        '.btn-primary': {
          backgroundColor: 'rgb(59 130 246)',
          color: 'white',
          borderColor: 'rgb(59 130 246)',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
          '&:hover': {
            backgroundColor: 'rgb(37 99 235)',
            borderColor: 'rgb(37 99 235)',
            boxShadow: '0 8px 12px -2px rgba(59, 130, 246, 0.4)',
          },
        },
        
        '.btn-secondary': {
          backgroundColor: 'rgb(241 245 249)',
          color: 'rgb(30 41 59)',
          borderColor: 'rgb(148 163 184)',
          '&:hover': {
            backgroundColor: 'rgb(226 232 240)',
          },
        },
        
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: 'rgb(30 41 59)',
          borderColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgb(241 245 249)',
          },
        },
        
        '.btn-danger': {
          backgroundColor: 'rgb(239 68 68)',
          color: 'white',
          borderColor: 'rgb(239 68 68)',
          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)',
          '&:hover': {
            backgroundColor: 'rgb(220 38 38)',
            borderColor: 'rgb(220 38 38)',
            boxShadow: '0 8px 12px -2px rgba(239, 68, 68, 0.4)',
          },
        },
        
        '.input': {
          width: '100%',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          color: 'rgb(30 41 59)',
          backgroundColor: 'white',
          border: '1px solid rgb(148 163 184)',
          borderRadius: '0.5rem',
          transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: 'rgb(59 130 246)',
            boxShadow: '0 0 0 3px rgb(59 130 246 / 0.1)',
          },
          '&:disabled': {
            backgroundColor: 'rgb(248 250 252)',
            color: 'rgb(148 163 184)',
            cursor: 'not-allowed',
          },
        },
        
        '.card': {
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgb(226 232 240)',
        },
        
        '.label': {
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'rgb(30 41 59)',
          marginBottom: '0.5rem',
        },
        
        '.text-error': {
          color: 'rgb(239 68 68)',
          fontSize: '0.875rem',
          marginTop: '0.25rem',
        },
      })
    },
  ],
} satisfies Config
