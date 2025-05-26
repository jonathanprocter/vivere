/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#496a70',
        background: '#F8F7F3',
        accent: '#C9A06F',
        text: '#333333',
      },
      fontFamily: {
        sans: ['Montserrat', 'Open Sans', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'md': '0.375rem',
        'lg': '0.5rem',
      },
    },
  },
  plugins: [],
}
