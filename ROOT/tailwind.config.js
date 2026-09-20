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
        // Bedrock Union brand palette — gold "BEDROCK" + royal-blue "UNION"
        // on a bright Minecraft sky backdrop.
        bu: {
          sky: '#1E88E5',
          skyMid: '#2E96E9',
          skyLight: '#64B5F6',
          surface: '#0E4A87',
          surfaceHover: '#1565C0',
          shell: '#0B3C70',
          blue: '#1976D2',
          blueAccent: '#42A5F5',
          gold: '#FBBF24',
          goldLight: '#FFF3C4',
          goldDeep: '#D97706',
          text: '#FFFFFF',
          muted: '#BAE6FD',
          dim: '#7DD3FC',
          border: 'rgba(255, 255, 255, 0.20)',
          borderLight: 'rgba(255, 255, 255, 0.10)',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(25, 118, 210, 0.55)',
        'glow-blue-sm': '0 0 15px -3px rgba(66, 165, 245, 0.45)',
        'glow-gold': '0 0 22px -4px rgba(251, 191, 36, 0.55)',
        'glow-gold-sm': '0 0 14px -3px rgba(251, 191, 36, 0.40)',
        'glow-sky': '0 0 20px -5px rgba(100, 181, 246, 0.50)',
        // legacy aliases kept so any older markup still resolves
        'glow-purple': '0 0 25px -5px rgba(25, 118, 210, 0.55)',
        'glow-purple-sm': '0 0 15px -3px rgba(66, 165, 245, 0.45)',
        'glow-cyan': '0 0 20px -5px rgba(100, 181, 246, 0.50)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        minecraft: ['"MinecraftTen"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
