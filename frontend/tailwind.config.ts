import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#09111f',
          50: '#0f1a2d',
          100: '#142037',
          200: '#1c2a43',
          300: '#283752',
        },
        accent: {
          DEFAULT: '#14b8a6',
          light: '#5eead4',
          dark: '#0f766e',
          glow: 'rgba(20, 184, 166, 0.22)',
        },
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mesh': 'radial-gradient(circle at 20% 0%, rgba(20,184,166,0.12), transparent 28%), radial-gradient(circle at 82% 10%, rgba(59,130,246,0.10), transparent 25%), linear-gradient(180deg, rgba(9,17,31,1) 0%, rgba(15,26,45,1) 100%)',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        grid: '64px 64px',
      },
      boxShadow: {
        glow: '0 10px 24px rgba(20, 184, 166, 0.14)',
        'glow-gold': '0 10px 24px rgba(245, 158, 11, 0.12)',
        card: '0 1px 2px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255,255,255,0.03)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
