module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // adjust based on your file types
  ],
  safelist: [
    'space-y-0',
    'space-y-1',
    'space-y-2',
    'space-y-4',
    'space-y-6',
    'space-y-8',
    'space-y-10',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
      },
      colors: {
        background: '#000000',
        primaryText: '#ffffff',
        secondaryText: '#9CA3AF', // gray-400
      },
      fontSize: {
        nav: ['0.875rem', { lineHeight: '1.25rem' }],
      },
    },
  },
  plugins: [],
}
