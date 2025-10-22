/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        'purple-primary': 'rgb(124, 92, 250)',
        'cyan-secondary': 'rgb(75, 195, 247)',
        'coral-accent': 'rgb(255, 111, 97)',
        'emerald': 'rgb(16, 185, 129)',
        'amber': 'rgb(251, 191, 36)',
        'rose': 'rgb(244, 63, 94)',
        'violet': 'rgb(139, 92, 246)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
