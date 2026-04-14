import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#5cb829',
          hover: '#4da223',
          dark: '#3d8a1b',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f5f5f5',
          dark: '#101010',
          darker: '#0a0a0a',
          light: '#1a1a1a',
          lighter: '#2a2a2a',
        },
        brand: {
          DEFAULT: '#5cb829',
          dark: '#4da223',
        },
        text: {
          DEFAULT: '#101010',
          muted: '#6b7280',
          inverse: '#ffffff',
        },
        urgency: {
          DEFAULT: '#d43a35',
          light: '#e85550',
        },
        border: {
          DEFAULT: 'rgba(16,16,16,0.12)',
          strong: 'rgba(16,16,16,0.24)',
        },
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        display: ['Barlow', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '3.75rem',
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(16,16,16,0.06)',
        card: '0 4px 16px rgba(16,16,16,0.08)',
      },
    },
  },
} satisfies Config
