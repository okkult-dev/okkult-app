/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#080706',
        surface: '#0D0C0A',
        border:  '#1A1815',
        orange:  '#C45A0A',
        'orange-light': '#E06B15',
        'orange-dark':  '#9A4508',
        green:   '#2a6a2a',
        'green-light':  '#55cc55',
        red:     '#6a2a2a',
        'red-light':    '#cc5555',
        blue:    '#334499',
        'blue-light':   '#6688ee',
        gray1:   '#AAAAAA',
        gray2:   '#666666',
        gray3:   '#333333',
      },
      fontFamily: {
        mono: ['DM Mono', 'Courier New', 'monospace'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
