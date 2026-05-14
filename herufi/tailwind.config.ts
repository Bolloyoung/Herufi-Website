import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#1C1C1E',
        forest: '#1B4332',
        'forest-light': '#2D6A4F',
        gold: '#C9A84C',
        'gold-light': '#E8C96A',
        cream: '#FAFAF8',
        'gray-soft': '#F5F5F3',
        'border-soft': '#E5E5E3',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1C1C1E',
            'h1,h2,h3,h4': { color: '#1C1C1E', fontWeight: '600' },
            a: { color: '#1B4332' },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
