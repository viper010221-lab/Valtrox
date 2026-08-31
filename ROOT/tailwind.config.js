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
        valtrox: {
          bg: '#0F0F17',
          card: '#171722',
          cardHover: '#1F1F2E',
          cardDark: '#12121B',
          cardGlass: 'rgba(23, 23, 34, 0.75)',
          purple: '#7C3AED',
          purpleAccent: '#8B5CF6',
          purpleGlow: 'rgba(124, 58, 237, 0.4)',
          text: '#F5F5F5',
          muted: '#A1A1AA',
          dim: '#71717A',
          border: '#252538',
          borderLight: 'rgba(255, 255, 255, 0.08)',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(124, 58, 237, 0.45)',
        'glow-purple-sm': '0 0 15px -3px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.4)',
        'glow-gold': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
};
