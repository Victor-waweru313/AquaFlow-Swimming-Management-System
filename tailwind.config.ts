import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f8fc',
          100: '#e0f1f9',
          200: '#c1e3f3',
          300: '#a2d5ed',
          400: '#83c7e7',
          500: '#64b9e1',
          600: '#2a8fc4',
          700: '#0B3D63',
          800: '#082d4a',
          900: '#051d31',
        },
        accent: {
          50: '#f0fdfc',
          100: '#e0fbf9',
          200: '#c1f7f3',
          300: '#a2f3ed',
          400: '#83efe7',
          500: '#64ebe1',
          600: '#2ac9b9',
          700: '#14B8A6',
          800: '#0d8a7d',
          900: '#065c54',
        },
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        sm: '0.375rem',
        base: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
}
export default config
