import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#9BCBEB',
          hover: '#7FB3D9',
          dark: '#5A9AC2',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f7f9fb',
          dark: '#000000',
          darker: '#000000',
          light: '#1a1a1a',
          lighter: '#2a2a2a',
        },
        brand: {
          DEFAULT: '#9BCBEB',
          dark: '#7FB3D9',
        },
        text: {
          DEFAULT: '#000000',
          muted: '#6b7280',
          inverse: '#ffffff',
        },
        urgency: {
          DEFAULT: '#d43a35',
          light: '#e85550',
        },
        border: {
          DEFAULT: 'rgba(0,0,0,0.12)',
          strong: 'rgba(0,0,0,0.24)',
        },
      },
      fontFamily: {
        sans: ['Inconsolata', 'monospace'],
        display: ['Inconsolata', 'monospace'],
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
